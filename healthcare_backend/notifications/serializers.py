from rest_framework import serializers
from .models import Notification, NotificationPreference
from authentication.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'notification_type', 'title', 'message',
                  'related_object_id', 'related_object_type', 'is_read', 'created_at']
        read_only_fields = ['created_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = NotificationPreference
        fields = ['id', 'user', 'email_notifications', 'push_notifications',
                  'appointment_reminders', 'message_notifications',
                  'exercise_reminders', 'system_notifications']
        
class NotificationPreferenceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['email_notifications', 'push_notifications',
                  'appointment_reminders', 'message_notifications',
                  'exercise_reminders', 'system_notifications']