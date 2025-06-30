from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta

def validate_future_date(value):
    """Validate that appointment date is not in the past"""
    if value < timezone.now().date():
        raise ValidationError('Appointment date cannot be in the past.')

def validate_business_hours(value):
    """Validate that appointment time is within business hours"""
    if value.hour < 8 or value.hour > 18:
        raise ValidationError('Appointments must be scheduled between 8:00 AM and 6:00 PM.')

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    )
    
    APPOINTMENT_TYPE_CHOICES = (
        ('consultation', 'Initial Consultation'),
        ('follow_up', 'Follow-up'),
        ('therapy', 'Therapy Session'),
        ('assessment', 'Assessment'),
        ('treatment', 'Treatment'),
        ('emergency', 'Emergency'),
    )
    
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='patient_appointments',
        limit_choices_to={'user_type': 'patient'}
    )
    physiotherapist = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='physiotherapist_appointments',
        limit_choices_to={'user_type': 'physiotherapist'}
    )
    date = models.DateField(
        validators=[validate_future_date],
        help_text="Appointment date"
    )
    start_time = models.TimeField(
        validators=[validate_business_hours],
        help_text="Appointment start time"
    )
    end_time = models.TimeField(
        help_text="Appointment end time"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='scheduled'
    )
    appointment_type = models.CharField(
        max_length=20,
        choices=APPOINTMENT_TYPE_CHOICES,
        default='consultation'
    )
    reason = models.TextField(
        help_text="Reason for appointment"
    )
    symptoms = models.TextField(
        blank=True, 
        null=True,
        help_text="Current symptoms or concerns"
    )
    notes = models.TextField(
        blank=True, 
        null=True,
        help_text="Additional notes from physiotherapist"
    )
    treatment_plan = models.TextField(
        blank=True, 
        null=True,
        help_text="Treatment plan and recommendations"
    )
    prescription = models.TextField(
        blank=True, 
        null=True,
        help_text="Prescribed exercises or medications"
    )
    next_appointment_recommended = models.BooleanField(
        default=False,
        help_text="Whether a follow-up appointment is recommended"
    )
    cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        help_text="Appointment cost"
    )
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('partial', 'Partially Paid'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    reminder_sent = models.BooleanField(
        default=False,
        help_text="Whether reminder notification was sent"
    )
    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cancelled_appointments',
        help_text="User who cancelled the appointment"
    )
    cancellation_reason = models.TextField(
        blank=True,
        null=True,
        help_text="Reason for cancellation"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'start_time']
        db_table = 'appointments'
        indexes = [
            models.Index(fields=['date', 'start_time']),
            models.Index(fields=['patient', 'date']),
            models.Index(fields=['physiotherapist', 'date']),
            models.Index(fields=['status']),
            models.Index(fields=['appointment_type']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_time__gt=models.F('start_time')),
                name='end_time_after_start_time'
            ),
        ]
    
    def __str__(self):
        return f"Appointment: {self.patient.username} with {self.physiotherapist.username} on {self.date} at {self.start_time}"
    
    def clean(self):
        """Custom validation"""
        super().clean()
        
        # Validate end time is after start time
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValidationError('End time must be after start time.')
        
        # Validate appointment duration (minimum 15 minutes, maximum 4 hours)
        if self.start_time and self.end_time:
            duration = datetime.combine(self.date, self.end_time) - datetime.combine(self.date, self.start_time)
            if duration < timedelta(minutes=15):
                raise ValidationError('Appointment must be at least 15 minutes long.')
            if duration > timedelta(hours=4):
                raise ValidationError('Appointment cannot be longer than 4 hours.')
    
    @property
    def duration(self):
        """Return appointment duration in minutes"""
        if self.start_time and self.end_time:
            duration = datetime.combine(self.date, self.end_time) - datetime.combine(self.date, self.start_time)
            return int(duration.total_seconds() / 60)
        return 0
    
    @property
    def is_upcoming(self):
        """Check if appointment is upcoming"""
        appointment_datetime = datetime.combine(self.date, self.start_time)
        appointment_datetime = timezone.make_aware(appointment_datetime)
        return appointment_datetime > timezone.now()
    
    @property
    def can_be_cancelled(self):
        """Check if appointment can be cancelled (at least 24 hours before)"""
        appointment_datetime = datetime.combine(self.date, self.start_time)
        appointment_datetime = timezone.make_aware(appointment_datetime)
        return appointment_datetime > timezone.now() + timedelta(hours=24)

class AppointmentFeedback(models.Model):
    RATING_CHOICES = (
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    )
    
    appointment = models.OneToOneField(
        Appointment, 
        on_delete=models.CASCADE, 
        related_name='feedback'
    )
    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        help_text="Overall rating for the appointment"
    )
    punctuality_rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        default=3,
        help_text="Rating for physiotherapist punctuality"
    )
    professionalism_rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        default=3,
        help_text="Rating for physiotherapist professionalism"
    )
    treatment_effectiveness = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        default=3,
        help_text="Rating for treatment effectiveness"
    )
    comments = models.TextField(
        blank=True, 
        null=True,
        max_length=1000,
        help_text="Additional comments about the appointment"
    )
    would_recommend = models.BooleanField(
        default=True,
        help_text="Would recommend this physiotherapist"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointment_feedback'
        indexes = [
            models.Index(fields=['rating']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Feedback for appointment on {self.appointment.date} - Rating: {self.rating}/5"

    @property
    def average_rating(self):
        """Calculate average rating across all categories"""
        ratings = [
            self.rating,
            self.punctuality_rating,
            self.professionalism_rating,
            self.treatment_effectiveness
        ]
        return sum(ratings) / len(ratings)

class AppointmentDocument(models.Model):
    """Model for storing appointment-related documents"""
    DOCUMENT_TYPE_CHOICES = [
        ('prescription', 'Prescription'),
        ('report', 'Medical Report'),
        ('xray', 'X-Ray'),
        ('mri', 'MRI Scan'),
        ('lab_result', 'Lab Result'),
        ('treatment_plan', 'Treatment Plan'),
        ('other', 'Other'),
    ]
    
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES,
        default='other'
    )
    title = models.CharField(
        max_length=200,
        help_text="Document title or description"
    )
    file = models.FileField(
        upload_to='appointment_documents/',
        help_text="Upload document file"
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )
    is_confidential = models.BooleanField(
        default=True,
        help_text="Whether document contains confidential information"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'appointment_documents'
        indexes = [
            models.Index(fields=['appointment', 'document_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.appointment}"
