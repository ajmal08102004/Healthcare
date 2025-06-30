from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification, NotificationPreference
from .serializers import (
    NotificationSerializer, NotificationPreferenceSerializer,
    NotificationPreferenceUpdateSerializer
)

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all notifications for the current user
        notifications = Notification.objects.filter(recipient=request.user)
        
        # Filter by read status if provided
        is_read = request.query_params.get('is_read', None)
        if is_read is not None:
            is_read = is_read.lower() == 'true'
            notifications = notifications.filter(is_read=is_read)
            
        # Filter by notification type if provided
        notification_type = request.query_params.get('type', None)
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
            
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    
    def put(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        
        # Only allow updating the is_read field
        is_read = request.data.get('is_read', None)
        if is_read is not None:
            notification.is_read = is_read
            notification.save()
            
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    
    def delete(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Mark all notifications for the current user as read
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})

class NotificationPreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get or create notification preferences for the current user
        preferences, created = NotificationPreference.objects.get_or_create(user=request.user)
        serializer = NotificationPreferenceSerializer(preferences)
        return Response(serializer.data)
    
    def put(self, request):
        # Get or create notification preferences for the current user
        preferences, created = NotificationPreference.objects.get_or_create(user=request.user)
        
        serializer = NotificationPreferenceUpdateSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(NotificationPreferenceSerializer(preferences).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
