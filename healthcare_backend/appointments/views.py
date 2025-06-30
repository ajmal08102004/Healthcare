from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count, Avg
from datetime import datetime, timedelta
from .models import Appointment, AppointmentFeedback, AppointmentDocument
from .serializers import (
    AppointmentSerializer, AppointmentCreateSerializer, AppointmentUpdateSerializer,
    AppointmentFeedbackSerializer, AppointmentDocumentSerializer
)

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointments with CRUD operations
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.select_related(
            'patient', 'physiotherapist', 'cancelled_by'
        ).prefetch_related('documents', 'feedback')
        
        if user.user_type == 'patient':
            queryset = queryset.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(physiotherapist=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset.order_by('-date', '-start_time')
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        now = timezone.now()
        today = now.date()
        current_time = now.time()
        
        queryset = self.get_queryset().filter(
            Q(date__gt=today) | 
            Q(date=today, start_time__gt=current_time)
        ).filter(status__in=['scheduled', 'confirmed'])
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        today = timezone.now().date()
        queryset = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        
        if not appointment.can_be_cancelled:
            return Response(
                {'error': 'Appointment cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cancellation_reason = request.data.get('reason', '')
        appointment.status = 'cancelled'
        appointment.cancelled_by = request.user
        appointment.cancellation_reason = cancellation_reason
        appointment.save()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment"""
        appointment = self.get_object()
        
        if appointment.status != 'scheduled':
            return Response(
                {'error': 'Only scheduled appointments can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        appointment.status = 'confirmed'
        appointment.save()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can mark appointments as completed'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        appointment.status = 'completed'
        appointment.notes = request.data.get('notes', appointment.notes)
        appointment.treatment_plan = request.data.get('treatment_plan', appointment.treatment_plan)
        appointment.prescription = request.data.get('prescription', appointment.prescription)
        appointment.save()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get appointment statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'scheduled': queryset.filter(status='scheduled').count(),
            'confirmed': queryset.filter(status='confirmed').count(),
            'completed': queryset.filter(status='completed').count(),
            'cancelled': queryset.filter(status='cancelled').count(),
            'no_show': queryset.filter(status='no_show').count(),
        }
        
        # Monthly statistics
        now = timezone.now()
        current_month = queryset.filter(
            date__year=now.year,
            date__month=now.month
        )
        stats['current_month'] = current_month.count()
        
        # Weekly statistics
        week_start = now.date() - timedelta(days=now.weekday())
        week_end = week_start + timedelta(days=6)
        stats['current_week'] = queryset.filter(
            date__range=[week_start, week_end]
        ).count()
        
        return Response(stats)

class AppointmentFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointment feedback
    """
    serializer_class = AppointmentFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = AppointmentFeedback.objects.select_related(
            'appointment__patient', 'appointment__physiotherapist'
        )
        
        if user.user_type == 'patient':
            queryset = queryset.filter(appointment__patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(appointment__physiotherapist=user)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        appointment = serializer.validated_data['appointment']
        
        # Only patients can create feedback for their appointments
        if self.request.user.user_type != 'patient':
            raise PermissionError("Only patients can provide feedback")
        
        if appointment.patient != self.request.user:
            raise PermissionError("You can only provide feedback for your own appointments")
        
        if appointment.status != 'completed':
            raise PermissionError("You can only provide feedback for completed appointments")
        
        serializer.save()

class AppointmentDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointment documents
    """
    serializer_class = AppointmentDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = AppointmentDocument.objects.select_related(
            'appointment__patient', 'appointment__physiotherapist', 'uploaded_by'
        )
        
        if user.user_type == 'patient':
            queryset = queryset.filter(appointment__patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(appointment__physiotherapist=user)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
