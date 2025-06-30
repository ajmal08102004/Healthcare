from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
import re

def validate_phone_number(value):
    """Validate phone number format"""
    phone_regex = re.compile(r'^\+?1?\d{9,15}$')
    if not phone_regex.match(value):
        raise ValidationError('Phone number must be entered in the format: "+999999999". Up to 15 digits allowed.')

def validate_strong_password(value):
    """Validate password strength"""
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long.')
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Password must contain at least one uppercase letter.')
    if not re.search(r'[a-z]', value):
        raise ValidationError('Password must contain at least one lowercase letter.')
    if not re.search(r'\d', value):
        raise ValidationError('Password must contain at least one digit.')

class User(AbstractUser):
    USER_TYPES = (
        ('patient', 'Patient'),
        ('physiotherapist', 'Physiotherapist'),
        ('admin', 'Admin'),
    )
    
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPES, 
        default='patient',
        help_text="Type of user account"
    )
    phone_number = models.CharField(
        max_length=17, 
        blank=True, 
        null=True,
        validators=[validate_phone_number],
        help_text="Phone number in international format"
    )
    date_of_birth = models.DateField(
        blank=True, 
        null=True,
        help_text="Date of birth for age verification"
    )
    address = models.TextField(
        blank=True, 
        null=True,
        max_length=500,
        help_text="Complete address"
    )
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        blank=True, 
        null=True,
        help_text="Profile picture (max 5MB)"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether the user's email/phone is verified"
    )
    is_active_session = models.BooleanField(
        default=False,
        help_text="Whether user has an active session"
    )
    last_login_ip = models.GenericIPAddressField(
        blank=True, 
        null=True,
        help_text="Last login IP address for security"
    )
    failed_login_attempts = models.PositiveIntegerField(
        default=0,
        help_text="Number of failed login attempts"
    )
    account_locked_until = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Account locked until this time"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user'
        indexes = [
            models.Index(fields=['user_type']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.username} ({self.user_type})"

    def clean(self):
        """Custom validation"""
        super().clean()
        if self.email:
            EmailValidator()(self.email)
        
    @property
    def full_name(self):
        """Return full name"""
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_patient(self):
        return self.user_type == 'patient'

    @property
    def is_physiotherapist(self):
        return self.user_type == 'physiotherapist'

    @property
    def is_admin_user(self):
        return self.user_type == 'admin'

class PatientProfile(models.Model):
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='patient_profile'
    )
    medical_history = models.TextField(
        blank=True, 
        null=True,
        help_text="Patient's medical history and conditions"
    )
    allergies = models.TextField(
        blank=True, 
        null=True,
        help_text="Known allergies and reactions"
    )
    current_medications = models.TextField(
        blank=True, 
        null=True,
        help_text="Current medications and dosages"
    )
    blood_type = models.CharField(
        max_length=3, 
        choices=BLOOD_TYPE_CHOICES, 
        blank=True, 
        null=True
    )
    height = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Height in centimeters"
    )
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Weight in kilograms"
    )
    emergency_contact_name = models.CharField(
        max_length=100, 
        blank=True, 
        null=True
    )
    emergency_contact_phone = models.CharField(
        max_length=17, 
        blank=True, 
        null=True,
        validators=[validate_phone_number]
    )
    emergency_contact_relationship = models.CharField(
        max_length=50, 
        blank=True, 
        null=True
    )
    insurance_provider = models.CharField(
        max_length=100, 
        blank=True, 
        null=True
    )
    insurance_number = models.CharField(
        max_length=50, 
        blank=True, 
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'patient_profiles'
        indexes = [
            models.Index(fields=['blood_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Patient Profile - {self.user.username}"

class PhysiotherapistProfile(models.Model):
    SPECIALIZATION_CHOICES = [
        ('orthopedic', 'Orthopedic Physiotherapy'),
        ('neurological', 'Neurological Physiotherapy'),
        ('cardiopulmonary', 'Cardiopulmonary Physiotherapy'),
        ('pediatric', 'Pediatric Physiotherapy'),
        ('geriatric', 'Geriatric Physiotherapy'),
        ('sports', 'Sports Physiotherapy'),
        ('women_health', 'Women\'s Health Physiotherapy'),
        ('manual_therapy', 'Manual Therapy'),
    ]
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='physiotherapist_profile'
    )
    license_number = models.CharField(
        max_length=50, 
        unique=True,
        help_text="Professional license number"
    )
    specializations = models.JSONField(
        default=list,
        help_text="List of specializations"
    )
    years_of_experience = models.PositiveIntegerField(
        default=0,
        help_text="Years of professional experience"
    )
    education = models.TextField(
        blank=True, 
        null=True,
        help_text="Educational background and degrees"
    )
    certifications = models.JSONField(
        default=list,
        help_text="Professional certifications"
    )
    consultation_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        help_text="Consultation fee per session"
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Whether accepting new patients"
    )
    bio = models.TextField(
        blank=True, 
        null=True,
        max_length=1000,
        help_text="Professional biography"
    )
    languages_spoken = models.JSONField(
        default=list,
        help_text="Languages spoken"
    )
    clinic_address = models.TextField(
        blank=True, 
        null=True,
        help_text="Clinic or practice address"
    )
    working_hours = models.JSONField(
        default=dict,
        help_text="Working hours schedule"
    )
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        help_text="Average rating from patients"
    )
    total_reviews = models.PositiveIntegerField(
        default=0,
        help_text="Total number of reviews"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'physiotherapist_profiles'
        indexes = [
            models.Index(fields=['license_number']),
            models.Index(fields=['is_available']),
            models.Index(fields=['rating']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Physiotherapist Profile - {self.user.username}"

    @property
    def specialization_display(self):
        """Return formatted specializations"""
        return ', '.join(self.specializations) if self.specializations else 'General'
