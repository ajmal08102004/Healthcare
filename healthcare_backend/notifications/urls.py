from django.urls import path
from .views import (
    NotificationListView, NotificationDetailView,
    MarkAllNotificationsReadView, NotificationPreferenceView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    path('preferences/', NotificationPreferenceView.as_view(), name='notification-preferences'),
]