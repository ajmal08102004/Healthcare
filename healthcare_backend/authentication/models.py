from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('patient', 'Patient'),
        ('physiotherapist', 'Physiotherapist'),
        ('admin', 'Admin'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    medical_history = models.TextField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    insurance_provider = models.CharField(max_length=100, blank=True, null=True)
    insurance_number = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"Patient Profile - {self.user.username}"

class PhysiotherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='physiotherapist_profile')
    license_number = models.CharField(max_length=50, unique=True)
    specializations = models.TextField(help_text="Comma-separated specializations")
    years_of_experience = models.PositiveIntegerField(default=0)
    education = models.TextField(blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Physiotherapist Profile - {self.user.username}"
