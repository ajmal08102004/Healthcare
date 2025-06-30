from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Appointment, AppointmentFeedback
from .serializers import (
    AppointmentSerializer, AppointmentCreateSerializer,
    AppointmentUpdateSerializer, AppointmentFeedbackSerializer
)

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointments.
    Provides CRUD operations for appointments with proper permissions.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'date', 'physiotherapist', 'patient']
    search_fields = ['reason', 'notes']
    ordering_fields = ['date', 'start_time', 'created_at']
    ordering = ['date', 'start_time']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user type and permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return Appointment.objects.all()
        elif user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return Appointment.objects.filter(physiotherapist=user)
        else:
            return Appointment.objects.none()
    
    def perform_create(self, serializer):
        """
        Set the patient to the current user if they're a patient.
        """
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()
    
    def update(self, request, *args, **kwargs):
        """
        Check permissions before updating.
        """
        instance = self.get_object()
        user = request.user
        
        # Check if user has permission to update this appointment
        if not (user == instance.patient or user == instance.physiotherapist or user.is_superuser):
            return Response(
                {'error': 'You do not have permission to update this appointment'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Check permissions before deleting.
        """
        instance = self.get_object()
        user = request.user
        
        # Check if user has permission to delete this appointment
        if not (user == instance.patient or user == instance.physiotherapist or user.is_superuser):
            return Response(
                {'error': 'You do not have permission to delete this appointment'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_feedback(self, request, pk=None):
        """
        Add feedback for an appointment (patients only).
        """
        appointment = self.get_object()
        
        # Only patients can add feedback for their appointments
        if request.user != appointment.patient:
            return Response(
                {'error': 'Only the patient can add feedback for this appointment'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if feedback already exists
        if hasattr(appointment, 'feedback'):
            return Response(
                {'error': 'Feedback already exists for this appointment'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AppointmentFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(appointment=appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def feedback(self, request, pk=None):
        """
        Get feedback for an appointment.
        """
        appointment = self.get_object()
        
        # Check if user has permission to view feedback
        if not (request.user == appointment.patient or 
                request.user == appointment.physiotherapist or 
                request.user.is_superuser):
            return Response(
                {'error': 'You do not have permission to view this feedback'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            feedback = appointment.feedback
            serializer = AppointmentFeedbackSerializer(feedback)
            return Response(serializer.data)
        except AppointmentFeedback.DoesNotExist:
            return Response(
                {'error': 'No feedback found for this appointment'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def upcoming(self, request):
        """
        Get upcoming appointments for the current user.
        """
        from django.utils import timezone
        
        queryset = self.get_queryset().filter(
            date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).order_by('date', 'start_time')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def past(self, request):
        """
        Get past appointments for the current user.
        """
        from django.utils import timezone
        
        queryset = self.get_queryset().filter(
            date__lt=timezone.now().date()
        ).order_by('-date', '-start_time')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class AppointmentFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointment feedback.
    """
    serializer_class = AppointmentFeedbackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['rating', 'appointment__status']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return AppointmentFeedback.objects.all()
        elif user.user_type == 'patient':
            return AppointmentFeedback.objects.filter(appointment__patient=user)
        elif user.user_type == 'physiotherapist':
            return AppointmentFeedback.objects.filter(appointment__physiotherapist=user)
        else:
            return AppointmentFeedback.objects.none()
    
    def update(self, request, *args, **kwargs):
        """
        Only the patient who created the feedback can update it.
        """
        instance = self.get_object()
        if request.user != instance.appointment.patient and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update your own feedback'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only the patient who created the feedback can delete it.
        """
        instance = self.get_object()
        if request.user != instance.appointment.patient and not request.user.is_superuser:
            return Response(
                {'error': 'You can only delete your own feedback'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)