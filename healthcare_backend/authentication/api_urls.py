from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, PatientProfileViewSet, PhysiotherapistProfileViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'patient-profiles', PatientProfileViewSet, basename='patient-profiles')
router.register(r'physiotherapist-profiles', PhysiotherapistProfileViewSet, basename='physiotherapist-profiles')

urlpatterns = [
    path('', include(router.urls)),
]