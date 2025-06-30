from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
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

# ViewSets for comprehensive API management

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        queryset = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(queryset, many=True)
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
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get notification statistics"""
        queryset = self.get_queryset()
        
        total = queryset.count()
        unread = queryset.filter(is_read=False).count()
        
        # Recent notifications (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent = queryset.filter(created_at__gte=week_ago).count()
        
        # By type
        by_type = {}
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            count = queryset.filter(notification_type=notification_type).count()
            by_type[notification_type] = count
        
        return Response({
            'total': total,
            'unread': unread,
            'read': total - unread,
            'recent_week': recent,
            'by_type': by_type
        })

class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notification preferences
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        """Get current user's notification preferences"""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=request.user
        )
        serializer = self.get_serializer(preferences)
        return Response(serializer.data)
