from django.urls import path
from .views import (
    ConversationListCreateView, ConversationDetailView,
    MessageListCreateView, AttachmentUploadView
)

urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('messages/<int:message_id>/attachments/', AttachmentUploadView.as_view(), name='attachment-upload'),
]