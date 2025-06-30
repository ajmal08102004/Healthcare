"""
Comprehensive RESTful API Views for Healthcare Application
Provides CRUD operations for all models with proper authentication and permissions
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta

# Import models
from authentication.models import User, PatientProfile, PhysiotherapistProfile
from appointments.models import Appointment, AppointmentFeedback, AppointmentDocument
from exercises.models import ExerciseCategory, Exercise, ExercisePlan, ExercisePlanItem, ExerciseProgress
from notifications.models import Notification, NotificationPreference
from chat.models import Conversation, Message, Attachment

# Import serializers
from authentication.serializers import (
    UserSerializer, PatientProfileSerializer, PhysiotherapistProfileSerializer,
    UserRegistrationSerializer, LoginSerializer, PasswordChangeSerializer
)
from appointments.serializers import (
    AppointmentSerializer, AppointmentFeedbackSerializer, AppointmentDocumentSerializer,
    AppointmentCreateSerializer, AppointmentUpdateSerializer
)
from exercises.serializers import (
    ExerciseCategorySerializer, ExerciseSerializer, ExercisePlanSerializer,
    ExercisePlanItemSerializer, ExerciseProgressSerializer
)
from notifications.serializers import NotificationSerializer, NotificationPreferenceSerializer
from chat.serializers import ConversationSerializer, MessageSerializer, AttachmentSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit it."""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'patient'):
            return obj.patient == request.user
        elif hasattr(obj, 'physiotherapist'):
            return obj.physiotherapist == request.user
        
        return obj == request.user


class IsPatientOrPhysiotherapist(permissions.BasePermission):
    """Permission for patient or physiotherapist access."""
    
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.user_type in ['patient', 'physiotherapist'])


# ============================================================================
# USER MANAGEMENT VIEWS
# ============================================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model with CRUD operations
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_verified', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'username', 'email']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter queryset based on user permissions"""
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'total_users': User.objects.count(),
            'patients': User.objects.filter(user_type='patient').count(),
            'physiotherapists': User.objects.filter(user_type='physiotherapist').count(),
            'verified_users': User.objects.filter(is_verified=True).count(),
            'active_users': User.objects.filter(is_active=True).count(),
        }
        return Response(stats)


class PatientProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PatientProfile model
    """
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['blood_type']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'emergency_contact_name']
    ordering_fields = ['created_at', 'user__username']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter based on user permissions"""
        if self.request.user.is_staff:
            return PatientProfile.objects.all()
        elif self.request.user.user_type == 'patient':
            return PatientProfile.objects.filter(user=self.request.user)
        elif self.request.user.user_type == 'physiotherapist':
            # Physiotherapists can see their patients
            return PatientProfile.objects.filter(
                user__appointment_patient__physiotherapist=self.request.user
            ).distinct()
        return PatientProfile.objects.none()


class PhysiotherapistProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PhysiotherapistProfile model
    """
    queryset = PhysiotherapistProfile.objects.all()
    serializer_class = PhysiotherapistProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_available', 'years_of_experience']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'specializations', 'clinic_name']
    ordering_fields = ['created_at', 'rating', 'years_of_experience']
    ordering = ['-rating', '-created_at']
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available physiotherapists"""
        available_physios = self.get_queryset().filter(is_available=True)
        serializer = self.get_serializer(available_physios, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        """Toggle physiotherapist availability"""
        physio = self.get_object()
        if physio.user != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        physio.is_available = not physio.is_available
        physio.save()
        return Response({'is_available': physio.is_available})


# ============================================================================
# APPOINTMENT MANAGEMENT VIEWS
# ============================================================================

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Appointment model with comprehensive CRUD operations
    """
    queryset = Appointment.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsPatientOrPhysiotherapist]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'appointment_type', 'payment_status', 'date']
    search_fields = ['patient__username', 'physiotherapist__username', 'reason', 'symptoms']
    ordering_fields = ['date', 'start_time', 'created_at']
    ordering = ['date', 'start_time']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        """Filter appointments based on user role"""
        user = self.request.user
        if user.is_staff:
            return Appointment.objects.all()
        elif user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return Appointment.objects.filter(physiotherapist=user)
        return Appointment.objects.none()
    
    def perform_create(self, serializer):
        """Set patient when creating appointment"""
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        upcoming = self.get_queryset().filter(
            date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).order_by('date', 'start_time')
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        today = self.get_queryset().filter(date=timezone.now().date())
        serializer = self.get_serializer(today, many=True)
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
        
        appointment.status = 'cancelled'
        appointment.cancelled_by = request.user
        appointment.cancellation_reason = request.data.get('reason', '')
        appointment.save()
        
        return Response({'message': 'Appointment cancelled successfully'})
    
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
        
        return Response({'message': 'Appointment confirmed successfully'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        
        if request.user != appointment.physiotherapist and not request.user.is_staff:
            return Response(
                {'error': 'Only the assigned physiotherapist can complete appointments'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        appointment.status = 'completed'
        appointment.treatment_plan = request.data.get('treatment_plan', '')
        appointment.prescription = request.data.get('prescription', '')
        appointment.notes = request.data.get('notes', '')
        appointment.save()
        
        return Response({'message': 'Appointment completed successfully'})


class AppointmentFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AppointmentFeedback model
    """
    queryset = AppointmentFeedback.objects.all()
    serializer_class = AppointmentFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating', 'would_recommend']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter feedback based on user role"""
        user = self.request.user
        if user.is_staff:
            return AppointmentFeedback.objects.all()
        elif user.user_type == 'patient':
            return AppointmentFeedback.objects.filter(appointment__patient=user)
        elif user.user_type == 'physiotherapist':
            return AppointmentFeedback.objects.filter(appointment__physiotherapist=user)
        return AppointmentFeedback.objects.none()


class AppointmentDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AppointmentDocument model
    """
    queryset = AppointmentDocument.objects.all()
    serializer_class = AppointmentDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['document_type', 'is_confidential']
    search_fields = ['title', 'appointment__patient__username']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter documents based on user permissions"""
        user = self.request.user
        if user.is_staff:
            return AppointmentDocument.objects.all()
        elif user.user_type == 'patient':
            return AppointmentDocument.objects.filter(appointment__patient=user)
        elif user.user_type == 'physiotherapist':
            return AppointmentDocument.objects.filter(appointment__physiotherapist=user)
        return AppointmentDocument.objects.none()


# ============================================================================
# EXERCISE MANAGEMENT VIEWS
# ============================================================================

class ExerciseCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExerciseCategory model
    """
    queryset = ExerciseCategory.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = ExerciseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Exercise model
    """
    queryset = Exercise.objects.filter(is_active=True)
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'difficulty']
    search_fields = ['name', 'description', 'instructions', 'benefits']
    ordering_fields = ['name', 'difficulty', 'duration', 'created_at']
    ordering = ['name']
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get exercises grouped by category"""
        category_id = request.query_params.get('category_id')
        if category_id:
            exercises = self.get_queryset().filter(category_id=category_id)
        else:
            exercises = self.get_queryset()
        
        serializer = self.get_serializer(exercises, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search_by_body_part(self, request):
        """Search exercises by body part"""
        body_part = request.query_params.get('body_part', '')
        if body_part:
            exercises = self.get_queryset().filter(
                target_body_parts__icontains=body_part
            )
            serializer = self.get_serializer(exercises, many=True)
            return Response(serializer.data)
        return Response([])


class ExercisePlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExercisePlan model
    """
    queryset = ExercisePlan.objects.all()
    serializer_class = ExercisePlanSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrPhysiotherapist]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'frequency_per_week']
    search_fields = ['name', 'description', 'patient__username', 'physiotherapist__username']
    ordering_fields = ['created_at', 'start_date', 'end_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter plans based on user role"""
        user = self.request.user
        if user.is_staff:
            return ExercisePlan.objects.all()
        elif user.user_type == 'patient':
            return ExercisePlan.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return ExercisePlan.objects.filter(physiotherapist=user)
        return ExercisePlan.objects.none()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active exercise plans"""
        active_plans = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_plans, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate an exercise plan"""
        plan = self.get_object()
        plan.status = 'active'
        plan.save()
        return Response({'message': 'Exercise plan activated'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete an exercise plan"""
        plan = self.get_object()
        plan.status = 'completed'
        plan.save()
        return Response({'message': 'Exercise plan completed'})


class ExercisePlanItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExercisePlanItem model
    """
    queryset = ExercisePlanItem.objects.all()
    serializer_class = ExercisePlanItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrPhysiotherapist]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['day_of_week', 'week_number', 'is_mandatory']
    ordering_fields = ['day_of_week', 'week_number']
    ordering = ['week_number', 'day_of_week']
    
    def get_queryset(self):
        """Filter items based on user permissions"""
        user = self.request.user
        if user.is_staff:
            return ExercisePlanItem.objects.all()
        elif user.user_type == 'patient':
            return ExercisePlanItem.objects.filter(exercise_plan__patient=user)
        elif user.user_type == 'physiotherapist':
            return ExercisePlanItem.objects.filter(exercise_plan__physiotherapist=user)
        return ExercisePlanItem.objects.none()


class ExerciseProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExerciseProgress model
    """
    queryset = ExerciseProgress.objects.all()
    serializer_class = ExerciseProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrPhysiotherapist]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['completion_status', 'difficulty_rating', 'date_completed']
    ordering_fields = ['date_completed', 'created_at']
    ordering = ['-date_completed']
    
    def get_queryset(self):
        """Filter progress based on user permissions"""
        user = self.request.user
        if user.is_staff:
            return ExerciseProgress.objects.all()
        elif user.user_type == 'patient':
            return ExerciseProgress.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return ExerciseProgress.objects.filter(
                exercise_plan_item__exercise_plan__physiotherapist=user
            )
        return ExerciseProgress.objects.none()
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get exercise progress statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total_sessions': queryset.count(),
            'completed_sessions': queryset.filter(completion_status='completed').count(),
            'average_pain_improvement': queryset.aggregate(
                avg_improvement=Avg('pain_improvement')
            )['avg_improvement'] or 0,
            'average_difficulty_rating': queryset.aggregate(
                avg_difficulty=Avg('difficulty_rating')
            )['avg_difficulty'] or 0,
        }
        
        return Response(stats)


# ============================================================================
# NOTIFICATION VIEWS
# ============================================================================

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Notification model
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['notification_type', 'is_read']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter notifications for current user"""
        return Notification.objects.filter(recipient=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        unread = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark specific notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for NotificationPreference model
    """
    queryset = NotificationPreference.objects.all()
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter preferences for current user"""
        return NotificationPreference.objects.filter(user=self.request.user)


# ============================================================================
# CHAT VIEWS
# ============================================================================

class ConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Conversation model
    """
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Filter conversations for current user"""
        return Conversation.objects.filter(participants=self.request.user)


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Message model
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['created_at']
    
    def get_queryset(self):
        """Filter messages for conversations user is part of"""
        return Message.objects.filter(
            conversation__participants=self.request.user
        )


class AttachmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Attachment model
    """
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter attachments for user's messages"""
        return Attachment.objects.filter(
            message__conversation__participants=self.request.user
        )