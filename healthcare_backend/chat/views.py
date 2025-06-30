from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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
