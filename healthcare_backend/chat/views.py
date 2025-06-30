from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta
from .models import Conversation, Message, Attachment
from .serializers import (
    ConversationSerializer, ConversationCreateSerializer,
    MessageSerializer, MessageCreateSerializer,
    AttachmentSerializer
)

class ConversationListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all conversations where the current user is a participant
        conversations = Conversation.objects.filter(participants=request.user)
        serializer = ConversationSerializer(
            conversations, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ConversationCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            conversation = serializer.save()
            return Response(
                ConversationSerializer(
                    conversation, 
                    context={'request': request}
                ).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_conversation(self, pk, user):
        conversation = get_object_or_404(Conversation, pk=pk)
        
        # Check if user is a participant in this conversation
        if user not in conversation.participants.all():
            self.permission_denied(self.request)
            
        return conversation
    
    def get(self, request, pk):
        conversation = self.get_conversation(pk, request.user)
        serializer = ConversationSerializer(
            conversation, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    def delete(self, request, pk):
        conversation = self.get_conversation(pk, request.user)
        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, conversation_id):
        # Ensure the conversation exists and user is a participant
        conversation = get_object_or_404(
            Conversation, 
            pk=conversation_id,
            participants=request.user
        )
        
        # Get all messages in the conversation
        messages = conversation.messages.all()
        
        # Mark messages as read if they were sent by other users
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        for message in unread_messages:
            message.is_read = True
            message.save()
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def post(self, request, conversation_id):
        # Ensure the conversation exists and user is a participant
        conversation = get_object_or_404(
            Conversation, 
            pk=conversation_id,
            participants=request.user
        )
        
        serializer = MessageCreateSerializer(
            data={
                **request.data,
                'conversation': conversation.id
            }, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            message = serializer.save()
            
            # Update conversation's updated_at timestamp
            conversation.save()  # This will update the auto_now field
            
            return Response(
                MessageSerializer(message).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AttachmentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, message_id):
        # Ensure the message exists and belongs to the user
        message = get_object_or_404(Message, pk=message_id, sender=request.user)
        
        # Handle file upload
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attachment = Attachment.objects.create(
            message=message,
            file=file,
            file_name=file.name,
            file_type=file.content_type
        )
        
        return Response(
            AttachmentSerializer(attachment).data, 
            status=status.HTTP_201_CREATED
        )

# ViewSets for comprehensive API management

class ConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing conversations
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ConversationCreateSerializer
        return ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).order_by('-updated_at')
    
    def perform_create(self, serializer):
        conversation = serializer.save()
        conversation.participants.add(self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent conversations"""
        queryset = self.get_queryset()[:10]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a conversation"""
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('created_at')
        
        # Mark messages as read
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        unread_messages.update(is_read=True)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get conversation statistics"""
        queryset = self.get_queryset()
        
        total_conversations = queryset.count()
        
        # Conversations with unread messages
        unread_conversations = queryset.filter(
            messages__is_read=False
        ).exclude(messages__sender=request.user).distinct().count()
        
        # Recent conversations (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_conversations = queryset.filter(updated_at__gte=week_ago).count()
        
        return Response({
            'total_conversations': total_conversations,
            'unread_conversations': unread_conversations,
            'recent_conversations': recent_conversations
        })

class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing messages
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MessageCreateSerializer
        return MessageSerializer
    
    def get_queryset(self):
        # Only show messages from conversations the user participates in
        user_conversations = Conversation.objects.filter(participants=self.request.user)
        return Message.objects.filter(
            conversation__in=user_conversations
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread messages"""
        queryset = self.get_queryset().filter(
            is_read=False
        ).exclude(sender=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all messages as read"""
        self.get_queryset().filter(
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)
        return Response({'message': 'All messages marked as read'})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark specific message as read"""
        message = self.get_object()
        if message.sender != request.user:
            message.is_read = True
            message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data)

class AttachmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing attachments
    """
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only show attachments from messages in conversations the user participates in
        user_conversations = Conversation.objects.filter(participants=self.request.user)
        return Attachment.objects.filter(
            message__conversation__in=user_conversations
        ).order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent attachments"""
        queryset = self.get_queryset()[:20]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get attachments grouped by file type"""
        file_type = request.query_params.get('type')
        if not file_type:
            return Response({'error': 'type parameter required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(file_type__icontains=file_type)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
