from rest_framework import serializers
from .models import Appointment, AppointmentFeedback
from authentication.serializers import UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    physiotherapist = UserSerializer(read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'physiotherapist', 'date', 'start_time', 'end_time', 
                  'status', 'reason', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['physiotherapist', 'date', 'start_time', 'end_time', 'reason', 'notes']
    
    def create(self, validated_data):
        # Set the patient to the current user
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)

class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'start_time', 'end_time', 'status', 'reason', 'notes']

class AppointmentFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentFeedback
        fields = ['id', 'appointment', 'rating', 'comments', 'created_at']
        read_only_fields = ['created_at']