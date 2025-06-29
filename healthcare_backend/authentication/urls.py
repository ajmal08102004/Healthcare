from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView,
    PatientProfileView, PhysiotherapistProfileView,
    ChangePasswordView, PhysiotherapistListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('patient-profile/', PatientProfileView.as_view(), name='patient-profile'),
    path('physiotherapist-profile/', PhysiotherapistProfileView.as_view(), name='physiotherapist-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('physiotherapists/', PhysiotherapistListView.as_view(), name='physiotherapist-list'),
]