"""
RESTful API URL Configuration for Healthcare Application
Provides comprehensive CRUD endpoints for all models
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
# from rest_framework.documentation import include_docs_urls

# Import API views
from authentication.views import (
    # User Management
    UserViewSet, PatientProfileViewSet, PhysiotherapistProfileViewSet,
)

from appointments.views import (
    # Appointment Management
    AppointmentViewSet, AppointmentFeedbackViewSet, AppointmentDocumentViewSet,
)

from exercises.views import (
    # Exercise Management
    ExerciseCategoryViewSet, ExerciseViewSet, ExercisePlanViewSet,
    ExercisePlanItemViewSet, ExerciseProgressViewSet,
)

from notifications.views import (
    # Notifications
    NotificationViewSet, NotificationPreferenceViewSet,
)

from chat.views import (
    # Chat
    ConversationViewSet, MessageViewSet, AttachmentViewSet
)

# Import authentication views
from authentication.views import (
    RegisterView, LoginView, LogoutView
)

# Create router and register viewsets
router = DefaultRouter()

# User Management Endpoints
router.register(r'users', UserViewSet, basename='user')
router.register(r'patients', PatientProfileViewSet, basename='patient')
router.register(r'physiotherapists', PhysiotherapistProfileViewSet, basename='physiotherapist')

# Appointment Management Endpoints
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'appointment-feedback', AppointmentFeedbackViewSet, basename='appointmentfeedback')
router.register(r'appointment-documents', AppointmentDocumentViewSet, basename='appointmentdocument')

# Exercise Management Endpoints
router.register(r'exercise-categories', ExerciseCategoryViewSet, basename='exercisecategory')
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'exercise-plans', ExercisePlanViewSet, basename='exerciseplan')
router.register(r'exercise-plan-items', ExercisePlanItemViewSet, basename='exerciseplanitem')
router.register(r'exercise-progress', ExerciseProgressViewSet, basename='exerciseprogress')

# Notification Endpoints
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'notification-preferences', NotificationPreferenceViewSet, basename='notificationpreference')

# Chat Endpoints
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

# API URL patterns
urlpatterns = [
    # API Root
    path('', include(router.urls)),
    
    # Authentication Endpoints
    path('auth/', include([
        path('register/', RegisterView.as_view(), name='register'),
        path('login/', LoginView.as_view(), name='login'),
        path('logout/', LogoutView.as_view(), name='logout'),
        path('token/', obtain_auth_token, name='api_token_auth'),
    ])),
    
    # API Documentation (disabled for now)
    # path('docs/', include_docs_urls(title='Healthcare API Documentation')),
]

# API endpoint summary for documentation
"""
Healthcare API Endpoints Summary
===============================

Authentication:
- POST /api/auth/register/ - User registration
- POST /api/auth/login/ - User login
- POST /api/auth/logout/ - User logout
- POST /api/auth/token/ - Get auth token
- POST /api/auth/password-reset/ - Password reset request
- POST /api/auth/password-reset-confirm/ - Password reset confirmation
- POST /api/auth/verify-email/ - Email verification

User Management:
- GET /api/users/ - List users
- POST /api/users/ - Create user
- GET /api/users/{id}/ - Get user details
- PUT /api/users/{id}/ - Update user
- PATCH /api/users/{id}/ - Partial update user
- DELETE /api/users/{id}/ - Delete user
- GET /api/users/me/ - Get current user profile
- POST /api/users/change_password/ - Change password
- GET /api/users/stats/ - Get user statistics

Patient Profiles:
- GET /api/patients/ - List patient profiles
- POST /api/patients/ - Create patient profile
- GET /api/patients/{id}/ - Get patient details
- PUT /api/patients/{id}/ - Update patient profile
- PATCH /api/patients/{id}/ - Partial update patient
- DELETE /api/patients/{id}/ - Delete patient profile

Physiotherapist Profiles:
- GET /api/physiotherapists/ - List physiotherapist profiles
- POST /api/physiotherapists/ - Create physiotherapist profile
- GET /api/physiotherapists/{id}/ - Get physiotherapist details
- PUT /api/physiotherapists/{id}/ - Update physiotherapist profile
- PATCH /api/physiotherapists/{id}/ - Partial update physiotherapist
- DELETE /api/physiotherapists/{id}/ - Delete physiotherapist profile
- GET /api/physiotherapists/available/ - Get available physiotherapists
- POST /api/physiotherapists/{id}/toggle_availability/ - Toggle availability

Appointments:
- GET /api/appointments/ - List appointments
- POST /api/appointments/ - Create appointment
- GET /api/appointments/{id}/ - Get appointment details
- PUT /api/appointments/{id}/ - Update appointment
- PATCH /api/appointments/{id}/ - Partial update appointment
- DELETE /api/appointments/{id}/ - Delete appointment
- GET /api/appointments/upcoming/ - Get upcoming appointments
- GET /api/appointments/today/ - Get today's appointments
- POST /api/appointments/{id}/cancel/ - Cancel appointment
- POST /api/appointments/{id}/confirm/ - Confirm appointment
- POST /api/appointments/{id}/complete/ - Complete appointment

Appointment Feedback:
- GET /api/appointment-feedback/ - List feedback
- POST /api/appointment-feedback/ - Create feedback
- GET /api/appointment-feedback/{id}/ - Get feedback details
- PUT /api/appointment-feedback/{id}/ - Update feedback
- PATCH /api/appointment-feedback/{id}/ - Partial update feedback
- DELETE /api/appointment-feedback/{id}/ - Delete feedback

Appointment Documents:
- GET /api/appointment-documents/ - List documents
- POST /api/appointment-documents/ - Upload document
- GET /api/appointment-documents/{id}/ - Get document details
- PUT /api/appointment-documents/{id}/ - Update document
- PATCH /api/appointment-documents/{id}/ - Partial update document
- DELETE /api/appointment-documents/{id}/ - Delete document

Exercise Categories:
- GET /api/exercise-categories/ - List categories
- POST /api/exercise-categories/ - Create category
- GET /api/exercise-categories/{id}/ - Get category details
- PUT /api/exercise-categories/{id}/ - Update category
- PATCH /api/exercise-categories/{id}/ - Partial update category
- DELETE /api/exercise-categories/{id}/ - Delete category

Exercises:
- GET /api/exercises/ - List exercises
- POST /api/exercises/ - Create exercise
- GET /api/exercises/{id}/ - Get exercise details
- PUT /api/exercises/{id}/ - Update exercise
- PATCH /api/exercises/{id}/ - Partial update exercise
- DELETE /api/exercises/{id}/ - Delete exercise
- GET /api/exercises/by_category/ - Get exercises by category
- GET /api/exercises/search_by_body_part/ - Search by body part

Exercise Plans:
- GET /api/exercise-plans/ - List exercise plans
- POST /api/exercise-plans/ - Create exercise plan
- GET /api/exercise-plans/{id}/ - Get plan details
- PUT /api/exercise-plans/{id}/ - Update plan
- PATCH /api/exercise-plans/{id}/ - Partial update plan
- DELETE /api/exercise-plans/{id}/ - Delete plan
- GET /api/exercise-plans/active/ - Get active plans
- POST /api/exercise-plans/{id}/activate/ - Activate plan
- POST /api/exercise-plans/{id}/complete/ - Complete plan

Exercise Plan Items:
- GET /api/exercise-plan-items/ - List plan items
- POST /api/exercise-plan-items/ - Create plan item
- GET /api/exercise-plan-items/{id}/ - Get item details
- PUT /api/exercise-plan-items/{id}/ - Update item
- PATCH /api/exercise-plan-items/{id}/ - Partial update item
- DELETE /api/exercise-plan-items/{id}/ - Delete item

Exercise Progress:
- GET /api/exercise-progress/ - List progress records
- POST /api/exercise-progress/ - Create progress record
- GET /api/exercise-progress/{id}/ - Get progress details
- PUT /api/exercise-progress/{id}/ - Update progress
- PATCH /api/exercise-progress/{id}/ - Partial update progress
- DELETE /api/exercise-progress/{id}/ - Delete progress
- GET /api/exercise-progress/stats/ - Get progress statistics

Notifications:
- GET /api/notifications/ - List notifications
- POST /api/notifications/ - Create notification
- GET /api/notifications/{id}/ - Get notification details
- PUT /api/notifications/{id}/ - Update notification
- PATCH /api/notifications/{id}/ - Partial update notification
- DELETE /api/notifications/{id}/ - Delete notification
- GET /api/notifications/unread/ - Get unread notifications
- POST /api/notifications/mark_all_read/ - Mark all as read
- POST /api/notifications/{id}/mark_read/ - Mark as read

Notification Preferences:
- GET /api/notification-preferences/ - List preferences
- POST /api/notification-preferences/ - Create preference
- GET /api/notification-preferences/{id}/ - Get preference details
- PUT /api/notification-preferences/{id}/ - Update preference
- PATCH /api/notification-preferences/{id}/ - Partial update preference
- DELETE /api/notification-preferences/{id}/ - Delete preference

Chat Conversations:
- GET /api/conversations/ - List conversations
- POST /api/conversations/ - Create conversation
- GET /api/conversations/{id}/ - Get conversation details
- PUT /api/conversations/{id}/ - Update conversation
- PATCH /api/conversations/{id}/ - Partial update conversation
- DELETE /api/conversations/{id}/ - Delete conversation

Messages:
- GET /api/messages/ - List messages
- POST /api/messages/ - Create message
- GET /api/messages/{id}/ - Get message details
- PUT /api/messages/{id}/ - Update message
- PATCH /api/messages/{id}/ - Partial update message
- DELETE /api/messages/{id}/ - Delete message

Attachments:
- GET /api/attachments/ - List attachments
- POST /api/attachments/ - Upload attachment
- GET /api/attachments/{id}/ - Get attachment details
- PUT /api/attachments/{id}/ - Update attachment
- PATCH /api/attachments/{id}/ - Partial update attachment
- DELETE /api/attachments/{id}/ - Delete attachment

Query Parameters:
- ?search= - Search across relevant fields
- ?ordering= - Order results by field (prefix with - for descending)
- ?page= - Pagination page number
- ?page_size= - Number of items per page
- ?{field}= - Filter by field value
- ?{field}__gte= - Greater than or equal filter
- ?{field}__lte= - Less than or equal filter
- ?{field}__contains= - Contains filter
- ?{field}__icontains= - Case-insensitive contains filter

Authentication:
- Include 'Authorization: Token {your_token}' header for authenticated requests
- Or include 'Authorization: Bearer {your_token}' for JWT authentication

Response Format:
- All responses are in JSON format
- List endpoints include pagination metadata
- Error responses include detailed error messages
- Success responses include relevant data and status codes
"""