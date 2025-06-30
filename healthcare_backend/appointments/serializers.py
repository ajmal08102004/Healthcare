from rest_framework import serializers
from django.utils import timezone
from django.db import models
from .models import Appointment, AppointmentFeedback, AppointmentDocument
from authentication.serializers import UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    physiotherapist = UserSerializer(read_only=True)
    duration = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    can_be_cancelled = serializers.ReadOnlyField()
    feedback = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'physiotherapist', 'date', 'start_time', 'end_time',
            'status', 'appointment_type', 'reason', 'symptoms', 'notes',
            'treatment_plan', 'prescription', 'next_appointment_recommended',
            'cost', 'payment_status', 'reminder_sent', 'cancelled_by',
            'cancellation_reason', 'duration', 'is_upcoming', 'can_be_cancelled',
            'feedback', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'duration', 'is_upcoming', 
            'can_be_cancelled', 'feedback'
        ]
    
    def get_feedback(self, obj):
        """Get appointment feedback if exists"""
        try:
            return AppointmentFeedbackSerializer(obj.feedback).data
        except AppointmentFeedback.DoesNotExist:
            return None

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'physiotherapist', 'date', 'start_time', 'end_time',
            'appointment_type', 'reason', 'symptoms', 'notes'
        ]
    
    def validate_date(self, value):
        """Validate appointment date"""
        if value < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        
        # Check if date is too far in the future (e.g., 6 months)
        max_date = timezone.now().date() + timezone.timedelta(days=180)
        if value > max_date:
            raise serializers.ValidationError("Appointment date cannot be more than 6 months in the future.")
        
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        # Validate time combination
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time.")
        
        # Check for conflicts with existing appointments
        physiotherapist = data['physiotherapist']
        date = data['date']
        start_time = data['start_time']
        end_time = data['end_time']
        
        # Check physiotherapist availability
        conflicting_appointments = Appointment.objects.filter(
            physiotherapist=physiotherapist,
            date=date,
            status__in=['scheduled', 'confirmed', 'in_progress']
        ).filter(
            models.Q(start_time__lt=end_time) & models.Q(end_time__gt=start_time)
        )
        
        if conflicting_appointments.exists():
            raise serializers.ValidationError(
                "Physiotherapist is not available at this time. Please choose a different time slot."
            )
        
        return data
    
    def create(self, validated_data):
        """Create appointment with patient as current user"""
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)

class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'date', 'start_time', 'end_time', 'status', 'appointment_type',
            'reason', 'symptoms', 'notes', 'treatment_plan', 'prescription',
            'next_appointment_recommended', 'cost', 'payment_status',
            'cancellation_reason'
        ]
    
    def validate(self, data):
        """Validate update based on current status and user role"""
        instance = self.instance
        user = self.context['request'].user
        
        # Only allow certain status changes based on user role
        if 'status' in data:
            new_status = data['status']
            current_status = instance.status
            
            # Patients can only cancel their own appointments
            if user.user_type == 'patient':
                if user != instance.patient:
                    raise serializers.ValidationError("You can only modify your own appointments.")
                
                if new_status not in ['cancelled']:
                    raise serializers.ValidationError("Patients can only cancel appointments.")
                
                if not instance.can_be_cancelled:
                    raise serializers.ValidationError(
                        "Appointment cannot be cancelled less than 24 hours before the scheduled time."
                    )
            
            # Physiotherapists can update their own appointments
            elif user.user_type == 'physiotherapist':
                if user != instance.physiotherapist:
                    raise serializers.ValidationError("You can only modify your own appointments.")
        
        return data
    
    def update(self, instance, validated_data):
        """Update appointment with additional logic"""
        user = self.context['request'].user
        
        # Set cancellation details if status is being changed to cancelled
        if validated_data.get('status') == 'cancelled' and instance.status != 'cancelled':
            validated_data['cancelled_by'] = user
        
        return super().update(instance, validated_data)

class AppointmentFeedbackSerializer(serializers.ModelSerializer):
    appointment = serializers.PrimaryKeyRelatedField(read_only=True)
    average_rating = serializers.ReadOnlyField()
    
    class Meta:
        model = AppointmentFeedback
        fields = [
            'id', 'appointment', 'rating', 'punctuality_rating',
            'professionalism_rating', 'treatment_effectiveness',
            'comments', 'would_recommend', 'average_rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'average_rating']
    
    def validate(self, data):
        """Validate feedback submission"""
        appointment = self.context.get('appointment')
        user = self.context['request'].user
        
        if not appointment:
            raise serializers.ValidationError("Appointment is required.")
        
        # Only patients can leave feedback
        if user.user_type != 'patient':
            raise serializers.ValidationError("Only patients can leave feedback.")
        
        # Only the patient who had the appointment can leave feedback
        if user != appointment.patient:
            raise serializers.ValidationError("You can only leave feedback for your own appointments.")
        
        # Appointment must be completed
        if appointment.status != 'completed':
            raise serializers.ValidationError("Feedback can only be left for completed appointments.")
        
        return data

class AppointmentDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AppointmentDocument
        fields = [
            'id', 'appointment', 'document_type', 'title', 'file',
            'uploaded_by', 'is_confidential', 'created_at'
        ]
        read_only_fields = ['created_at', 'uploaded_by']
    
    def create(self, validated_data):
        """Create document with uploader as current user"""
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)

class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for appointment lists"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'physiotherapist_name', 'date', 'start_time',
            'end_time', 'status', 'appointment_type', 'reason', 'duration',
            'cost', 'payment_status', 'created_at'
        ]