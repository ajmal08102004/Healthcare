from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
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
