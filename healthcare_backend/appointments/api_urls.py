from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import AppointmentViewSet, AppointmentFeedbackViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'appointment-feedback', AppointmentFeedbackViewSet, basename='appointment-feedback')

urlpatterns = [
    path('', include(router.urls)),
]