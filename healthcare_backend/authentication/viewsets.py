from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from .models import PatientProfile, PhysiotherapistProfile
from .serializers import (
    UserSerializer, PatientProfileSerializer, PhysiotherapistProfileSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users.
    Provides CRUD operations for users with proper permissions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user_type', 'is_active', 'is_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'created_at', 'last_login']
    ordering = ['username']
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['create']:
            permission_classes = []  # Allow registration
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return User.objects.all()
        elif user.user_type == 'physiotherapist':
            # Physiotherapists can see their patients and other physiotherapists
            return User.objects.filter(
                models.Q(user_type='patient') | 
                models.Q(user_type='physiotherapist') |
                models.Q(id=user.id)
            )
        else:
            # Patients can only see themselves and physiotherapists
            return User.objects.filter(
                models.Q(user_type='physiotherapist') |
                models.Q(id=user.id)
            )
    
    def update(self, request, *args, **kwargs):
        """
        Users can only update their own profile unless they're admin.
        """
        instance = self.get_object()
        if instance != request.user and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update your own profile'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Users can only delete their own account unless they're admin.
        """
        instance = self.get_object()
        if instance != request.user and not request.user.is_superuser:
            return Response(
                {'error': 'You can only delete your own account'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get current user's profile.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def physiotherapists(self, request):
        """
        Get list of available physiotherapists.
        """
        physiotherapists = User.objects.filter(
            user_type='physiotherapist', 
            is_active=True,
            physiotherapist_profile__is_available=True
        )
        serializer = self.get_serializer(physiotherapists, many=True)
        return Response(serializer.data)

class PatientProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient profiles.
    """
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return PatientProfile.objects.all()
        elif user.user_type == 'physiotherapist':
            # Physiotherapists can see their patients' profiles
            return PatientProfile.objects.filter(
                user__patient_appointments__physiotherapist=user
            ).distinct()
        elif user.user_type == 'patient':
            # Patients can only see their own profile
            return PatientProfile.objects.filter(user=user)
        else:
            return PatientProfile.objects.none()
    
    def update(self, request, *args, **kwargs):
        """
        Only the patient or admin can update the profile.
        """
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update your own profile'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class PhysiotherapistProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing physiotherapist profiles.
    """
    queryset = PhysiotherapistProfile.objects.all()
    serializer_class = PhysiotherapistProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_available', 'years_of_experience']
    search_fields = ['user__first_name', 'user__last_name', 'specializations', 'education']
    ordering_fields = ['consultation_fee', 'years_of_experience', 'user__first_name']
    ordering = ['user__first_name']
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return PhysiotherapistProfile.objects.all()
        elif user.user_type == 'physiotherapist':
            # Physiotherapists can see their own profile and other physiotherapists
            return PhysiotherapistProfile.objects.all()
        else:
            # Patients can see all available physiotherapists
            return PhysiotherapistProfile.objects.filter(
                user__is_active=True, 
                is_available=True
            )
    
    def update(self, request, *args, **kwargs):
        """
        Only the physiotherapist or admin can update the profile.
        """
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update your own profile'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)