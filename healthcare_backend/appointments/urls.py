from django.urls import path
from .views import (
    AppointmentListCreateView, AppointmentDetailView, AppointmentFeedbackView
)

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<int:appointment_id>/feedback/', AppointmentFeedbackView.as_view(), name='appointment-feedback'),
]