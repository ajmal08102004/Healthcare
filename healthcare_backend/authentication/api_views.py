from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
import logging

from .models import PatientProfile, PhysiotherapistProfile
from .serializers import (
    UserSerializer, UserDetailSerializer, UserRegistrationSerializer,
    LoginSerializer, PatientProfileSerializer, PhysiotherapistProfileSerializer,
    PatientProfileUpdateSerializer, PhysiotherapistProfileUpdateSerializer,
    PasswordChangeSerializer, UserUpdateSerializer
)

User = get_user_model()
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    """User registration endpoint with comprehensive validation"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                with transaction.atomic():
                    user = serializer.save()
                    token, created = Token.objects.get_or_create(user=user)
                    
                    logger.info(f"New user registered: {user.username} ({user.user_type})")
                    
                    return Response({
                        'user': UserDetailSerializer(user).data,
                        'token': token.key,
                        'message': 'Registration successful'
                    }, status=status.HTTP_201_CREATED)
            
            return Response({
                'errors': serializer.errors,
                'message': 'Registration failed'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'error': 'Registration failed due to server error',
                'message': 'Please try again later'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    """Enhanced login endpoint with security features"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                
                # Check if account is locked
                if user.account_locked_until and user.account_locked_until > timezone.now():
                    return Response({
                        'error': 'Account temporarily locked',
                        'message': f'Account locked until {user.account_locked_until}'
                    }, status=status.HTTP_423_LOCKED)
                
                # Reset failed attempts on successful login
                user.failed_login_attempts = 0
                user.account_locked_until = None
                user.is_active_session = True
                user.last_login_ip = self.get_client_ip(request)
                user.save()
                
                token, created = Token.objects.get_or_create(user=user)
                
                logger.info(f"User logged in: {user.username}")
                
                return Response({
                    'user': UserDetailSerializer(user).data,
                    'token': token.key,
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            
            # Handle failed login attempt
            username = request.data.get('username')
            if username:
                try:
                    user = User.objects.get(username=username)
                    user.failed_login_attempts += 1
                    
                    # Lock account after 5 failed attempts
                    if user.failed_login_attempts >= 5:
                        user.account_locked_until = timezone.now() + timezone.timedelta(minutes=30)
                        logger.warning(f"Account locked for user: {username}")
                    
                    user.save()
                except User.DoesNotExist:
                    pass
            
            return Response({
                'errors': serializer.errors,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': 'Login failed due to server error',
                'message': 'Please try again later'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class LogoutView(APIView):
    """Secure logout endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Update user session status
            request.user.is_active_session = False
            request.user.save()
            
            # Delete token
            try:
                request.user.auth_token.delete()
            except:
                pass
            
            logger.info(f"User logged out: {request.user.username}")
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'error': 'Logout failed',
                'message': 'Please try again'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
    """User profile management endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get user profile"""
        try:
            serializer = UserDetailSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Profile fetch error: {str(e)}")
            return Response({
                'error': 'Failed to fetch profile'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        """Update user profile"""
        try:
            with transaction.atomic():
                # Update basic user information
                user_serializer = UserUpdateSerializer(
                    request.user, 
                    data=request.data, 
                    partial=True
                )
                
                if user_serializer.is_valid():
                    user_serializer.save()
                    
                    # Update profile based on user type
                    if request.user.user_type == 'patient':
                        try:
                            profile = request.user.patient_profile
                            profile_serializer = PatientProfileUpdateSerializer(
                                profile, 
                                data=request.data, 
                                partial=True
                            )
                            if profile_serializer.is_valid():
                                profile_serializer.save()
                            else:
                                return Response({
                                    'errors': profile_serializer.errors
                                }, status=status.HTTP_400_BAD_REQUEST)
                        except PatientProfile.DoesNotExist:
                            PatientProfile.objects.create(user=request.user)
                    
                    elif request.user.user_type == 'physiotherapist':
                        try:
                            profile = request.user.physiotherapist_profile
                            profile_serializer = PhysiotherapistProfileUpdateSerializer(
                                profile, 
                                data=request.data, 
                                partial=True
                            )
                            if profile_serializer.is_valid():
                                profile_serializer.save()
                            else:
                                return Response({
                                    'errors': profile_serializer.errors
                                }, status=status.HTTP_400_BAD_REQUEST)
                        except PhysiotherapistProfile.DoesNotExist:
                            PhysiotherapistProfile.objects.create(
                                user=request.user,
                                license_number=f"TEMP-{request.user.id}"
                            )
                    
                    logger.info(f"Profile updated for user: {request.user.username}")
                    
                    return Response({
                        'user': UserDetailSerializer(request.user).data,
                        'message': 'Profile updated successfully'
                    }, status=status.HTTP_200_OK)
                
                return Response({
                    'errors': user_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            return Response({
                'error': 'Failed to update profile'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    """Secure password change endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            serializer = PasswordChangeSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                # Change password
                request.user.set_password(serializer.validated_data['new_password'])
                request.user.save()
                
                # Invalidate all tokens for this user
                Token.objects.filter(user=request.user).delete()
                
                # Create new token
                token = Token.objects.create(user=request.user)
                
                logger.info(f"Password changed for user: {request.user.username}")
                
                return Response({
                    'token': token.key,
                    'message': 'Password changed successfully'
                }, status=status.HTTP_200_OK)
            
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            return Response({
                'error': 'Failed to change password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListView(generics.ListAPIView):
    """List users with filtering and search"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get('user_type')
        search = self.request.query_params.get('search')
        
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        if search:
            queryset = queryset.filter(
                models.Q(username__icontains=search) |
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(email__icontains=search)
            )
        
        return queryset.order_by('-created_at')

class PhysiotherapistListView(generics.ListAPIView):
    """List available physiotherapists"""
    serializer_class = PhysiotherapistProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PhysiotherapistProfile.objects.filter(
            user__user_type='physiotherapist',
            is_available=True
        ).select_related('user').order_by('-rating', 'user__first_name')