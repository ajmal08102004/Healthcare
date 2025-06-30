from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q, Count, Avg
from datetime import datetime, timedelta
from .models import PatientProfile, PhysiotherapistProfile
from .serializers import (
    UserSerializer, PatientProfileSerializer, PhysiotherapistProfileSerializer,
    UserRegistrationSerializer, PatientProfileUpdateSerializer,
    PhysiotherapistProfileUpdateSerializer, PasswordChangeSerializer
)

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            logout(request)
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = PatientProfileSerializer(profile)
            return Response(serializer.data)
        except PatientProfile.DoesNotExist:
            return Response({'error': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = PatientProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(PatientProfileSerializer(profile).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PatientProfile.DoesNotExist:
            return Response({'error': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)

class PhysiotherapistProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = PhysiotherapistProfile.objects.get(user=request.user)
            serializer = PhysiotherapistProfileSerializer(profile)
            return Response(serializer.data)
        except PhysiotherapistProfile.DoesNotExist:
            return Response({'error': 'Physiotherapist profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        try:
            profile = PhysiotherapistProfile.objects.get(user=request.user)
            serializer = PhysiotherapistProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(PhysiotherapistProfileSerializer(profile).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PhysiotherapistProfile.DoesNotExist:
            return Response({'error': 'Physiotherapist profile not found'}, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                # Update session auth hash to keep user logged in
                login(request, user)
                return Response({'message': 'Password changed successfully'})
            return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhysiotherapistListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhysiotherapistProfileSerializer
    
    def get_queryset(self):
        queryset = PhysiotherapistProfile.objects.filter(user__is_active=True, is_available=True)
        
        # Filter by specialization if provided
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(specializations__icontains=specialization)
            
        return queryset

# ViewSets for comprehensive API management

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            return Response({'error': 'Incorrect old password'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient profiles
    """
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return PatientProfile.objects.filter(user=user)
        elif user.user_type == 'physiotherapist':
            # Physiotherapists can see their patients' profiles
            from appointments.models import Appointment
            patient_ids = Appointment.objects.filter(
                physiotherapist=user
            ).values_list('patient_id', flat=True).distinct()
            return PatientProfile.objects.filter(user_id__in=patient_ids)
        elif user.is_staff:
            return PatientProfile.objects.all()
        return PatientProfile.objects.none()
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current patient's profile"""
        if request.user.user_type != 'patient':
            return Response({'error': 'Only patients can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except PatientProfile.DoesNotExist:
            return Response({'error': 'Patient profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get patient statistics"""
        if request.user.user_type != 'physiotherapist':
            return Response({'error': 'Only physiotherapists can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        queryset = self.get_queryset()
        
        # Age distribution
        from django.db.models import Case, When, IntegerField
        age_ranges = queryset.aggregate(
            under_30=Count(Case(When(age__lt=30, then=1), output_field=IntegerField())),
            age_30_50=Count(Case(When(age__gte=30, age__lt=50, then=1), output_field=IntegerField())),
            over_50=Count(Case(When(age__gte=50, then=1), output_field=IntegerField()))
        )
        
        # Gender distribution
        gender_dist = queryset.values('gender').annotate(count=Count('gender'))
        
        # Blood type distribution
        blood_type_dist = queryset.values('blood_type').annotate(count=Count('blood_type'))
        
        return Response({
            'total_patients': queryset.count(),
            'age_distribution': age_ranges,
            'gender_distribution': list(gender_dist),
            'blood_type_distribution': list(blood_type_dist)
        })

class PhysiotherapistProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing physiotherapist profiles
    """
    serializer_class = PhysiotherapistProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'physiotherapist':
            return PhysiotherapistProfile.objects.filter(user=user)
        elif user.user_type == 'patient':
            # Patients can see available physiotherapists
            return PhysiotherapistProfile.objects.filter(
                user__is_active=True, 
                is_available=True
            )
        elif user.is_staff:
            return PhysiotherapistProfile.objects.all()
        return PhysiotherapistProfile.objects.none()
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current physiotherapist's profile"""
        if request.user.user_type != 'physiotherapist':
            return Response({'error': 'Only physiotherapists can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = PhysiotherapistProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except PhysiotherapistProfile.DoesNotExist:
            return Response({'error': 'Physiotherapist profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available physiotherapists"""
        queryset = self.get_queryset().filter(is_available=True)
        
        # Filter by specialization
        specialization = request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specializations__icontains=specialization)
        
        # Filter by rating
        min_rating = request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        
        # Search by name or clinic
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(clinic_name__icontains=search)
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get physiotherapist statistics"""
        if request.user.user_type != 'physiotherapist':
            return Response({'error': 'Only physiotherapists can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        profile = PhysiotherapistProfile.objects.get(user=request.user)
        
        # Get appointment statistics
        from appointments.models import Appointment
        appointments = Appointment.objects.filter(physiotherapist=request.user)
        
        total_appointments = appointments.count()
        completed_appointments = appointments.filter(status='completed').count()
        
        # Monthly statistics
        now = timezone.now()
        current_month = appointments.filter(
            date__year=now.year,
            date__month=now.month
        ).count()
        
        # Patient count
        unique_patients = appointments.values('patient').distinct().count()
        
        return Response({
            'total_appointments': total_appointments,
            'completed_appointments': completed_appointments,
            'completion_rate': (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0,
            'current_month_appointments': current_month,
            'unique_patients': unique_patients,
            'rating': profile.rating,
            'years_of_experience': profile.years_of_experience
        })
