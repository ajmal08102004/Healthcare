from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class ExerciseCategory(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Category description"
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Icon class name for UI"
    )
    color = models.CharField(
        max_length=7,
        default='#007bff',
        help_text="Hex color code for category"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether category is active"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Sort order for display"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Exercise Categories"
        db_table = 'exercise_categories'
        ordering = ['sort_order', 'name']
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['sort_order']),
        ]
    
    def __str__(self):
        return self.name

class Exercise(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    
    BODY_PART_CHOICES = [
        ('neck', 'Neck'),
        ('shoulders', 'Shoulders'),
        ('arms', 'Arms'),
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('core', 'Core/Abs'),
        ('hips', 'Hips'),
        ('legs', 'Legs'),
        ('knees', 'Knees'),
        ('ankles', 'Ankles'),
        ('full_body', 'Full Body'),
    ]
    
    name = models.CharField(
        max_length=100,
        help_text="Exercise name"
    )
    description = models.TextField(
        help_text="Detailed exercise description"
    )
    instructions = models.TextField(
        default="",
        help_text="Step-by-step instructions"
    )
    category = models.ForeignKey(
        ExerciseCategory, 
        on_delete=models.CASCADE, 
        related_name='exercises'
    )
    difficulty = models.CharField(
        max_length=20, 
        choices=DIFFICULTY_CHOICES, 
        default='beginner'
    )
    target_body_parts = models.JSONField(
        default=list,
        help_text="List of target body parts"
    )
    duration = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        help_text="Duration in minutes"
    )
    repetitions = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    sets = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    rest_time = models.PositiveIntegerField(
        default=30,
        help_text="Rest time between sets in seconds"
    )
    calories_burned = models.PositiveIntegerField(
        default=0,
        help_text="Estimated calories burned per session"
    )
    equipment_needed = models.JSONField(
        default=list,
        help_text="List of equipment needed"
    )
    precautions = models.TextField(
        blank=True,
        null=True,
        help_text="Safety precautions and contraindications"
    )
    benefits = models.TextField(
        blank=True,
        null=True,
        help_text="Exercise benefits"
    )
    video_url = models.URLField(
        blank=True, 
        null=True,
        help_text="Video demonstration URL"
    )
    image = models.ImageField(
        upload_to='exercise_images/', 
        blank=True, 
        null=True,
        help_text="Exercise demonstration image"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether exercise is active"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_exercises',
        help_text="User who created this exercise"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'exercises'
        ordering = ['name']
        indexes = [
            models.Index(fields=['category', 'difficulty']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.name
    
    def clean(self):
        """Custom validation"""
        super().clean()
        if self.duration <= 0:
            raise ValidationError('Duration must be positive.')
        if self.repetitions <= 0:
            raise ValidationError('Repetitions must be positive.')
        if self.sets <= 0:
            raise ValidationError('Sets must be positive.')

    @property
    def total_duration(self):
        """Calculate total exercise duration including rest time"""
        if self.sets > 1:
            return self.duration + (self.rest_time * (self.sets - 1) / 60)
        return self.duration

class ExercisePlan(models.Model):
    PLAN_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(
        max_length=100,
        help_text="Plan name"
    )
    description = models.TextField(
        help_text="Plan description and goals"
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='exercise_plans',
        limit_choices_to={'user_type': 'patient'}
    )
    physiotherapist = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='created_exercise_plans',
        limit_choices_to={'user_type': 'physiotherapist'}
    )
    exercises = models.ManyToManyField(
        Exercise, 
        through='ExercisePlanItem'
    )
    start_date = models.DateField(
        help_text="Plan start date"
    )
    end_date = models.DateField(
        help_text="Plan end date"
    )
    status = models.CharField(
        max_length=20,
        choices=PLAN_STATUS_CHOICES,
        default='draft'
    )
    goals = models.TextField(
        blank=True,
        null=True,
        help_text="Treatment goals and objectives"
    )
    frequency_per_week = models.PositiveIntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(7)],
        help_text="Recommended frequency per week"
    )
    estimated_duration_weeks = models.PositiveIntegerField(
        default=4,
        help_text="Estimated duration in weeks"
    )
    difficulty_progression = models.BooleanField(
        default=False,
        help_text="Whether difficulty should progress over time"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes for the patient"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'exercise_plans'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['patient', 'status']),
            models.Index(fields=['physiotherapist', 'status']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.name} for {self.patient.username}"
    
    def clean(self):
        """Custom validation"""
        super().clean()
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError('End date must be after start date.')
    
    @property
    def progress_percentage(self):
        """Calculate plan completion percentage"""
        total_items = self.plan_items.count()
        if total_items == 0:
            return 0
        completed_items = self.plan_items.filter(
            progress__isnull=False
        ).distinct().count()
        return (completed_items / total_items) * 100

class ExercisePlanItem(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    exercise_plan = models.ForeignKey(
        ExercisePlan, 
        on_delete=models.CASCADE, 
        related_name='plan_items'
    )
    exercise = models.ForeignKey(
        Exercise, 
        on_delete=models.CASCADE
    )
    day_of_week = models.PositiveSmallIntegerField(
        choices=DAYS_OF_WEEK,
        help_text="Day of week for this exercise"
    )
    week_number = models.PositiveIntegerField(
        default=1,
        help_text="Week number in the plan"
    )
    custom_repetitions = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Custom repetitions (overrides exercise default)"
    )
    custom_sets = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Custom sets (overrides exercise default)"
    )
    custom_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Custom duration in minutes"
    )
    intensity_level = models.PositiveSmallIntegerField(
        choices=[
            (1, 'Very Light'),
            (2, 'Light'),
            (3, 'Moderate'),
            (4, 'Hard'),
            (5, 'Very Hard'),
        ],
        default=3,
        help_text="Exercise intensity level"
    )
    is_mandatory = models.BooleanField(
        default=True,
        help_text="Whether this exercise is mandatory"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of exercise in the day"
    )
    notes = models.TextField(
        blank=True, 
        null=True,
        help_text="Special instructions for this exercise"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'exercise_plan_items'
        ordering = ['week_number', 'day_of_week', 'order']
        indexes = [
            models.Index(fields=['exercise_plan', 'day_of_week']),
            models.Index(fields=['week_number']),
        ]
        unique_together = ['exercise_plan', 'exercise', 'day_of_week', 'week_number']
    
    def __str__(self):
        return f"{self.exercise.name} on {self.get_day_of_week_display()} (Week {self.week_number})"
    
    @property
    def effective_repetitions(self):
        """Return custom repetitions or exercise default"""
        return self.custom_repetitions or self.exercise.repetitions
    
    @property
    def effective_sets(self):
        """Return custom sets or exercise default"""
        return self.custom_sets or self.exercise.sets
    
    @property
    def effective_duration(self):
        """Return custom duration or exercise default"""
        return self.custom_duration or self.exercise.duration

class ExerciseProgress(models.Model):
    DIFFICULTY_RATING_CHOICES = [
        (1, 'Very Easy'),
        (2, 'Easy'),
        (3, 'Moderate'),
        (4, 'Hard'),
        (5, 'Very Hard'),
    ]
    
    PAIN_LEVEL_CHOICES = [
        (0, 'No Pain'),
        (1, 'Mild'),
        (2, 'Moderate'),
        (3, 'Severe'),
        (4, 'Very Severe'),
    ]
    
    COMPLETION_STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('partial', 'Partially Completed'),
        ('skipped', 'Skipped'),
        ('modified', 'Modified'),
    ]
    
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='exercise_progress',
        limit_choices_to={'user_type': 'patient'}
    )
    exercise_plan_item = models.ForeignKey(
        ExercisePlanItem, 
        on_delete=models.CASCADE, 
        related_name='progress'
    )
    date_completed = models.DateField(
        help_text="Date when exercise was performed"
    )
    completion_status = models.CharField(
        max_length=20,
        choices=COMPLETION_STATUS_CHOICES,
        default='completed'
    )
    completed_repetitions = models.PositiveIntegerField(
        default=0,
        help_text="Number of repetitions completed"
    )
    completed_sets = models.PositiveIntegerField(
        default=0,
        help_text="Number of sets completed"
    )
    actual_duration = models.PositiveIntegerField(
        default=0,
        help_text="Actual duration in minutes"
    )
    difficulty_rating = models.PositiveSmallIntegerField(
        choices=DIFFICULTY_RATING_CHOICES,
        default=3,
        help_text="How difficult was the exercise"
    )
    pain_level_before = models.PositiveSmallIntegerField(
        choices=PAIN_LEVEL_CHOICES,
        default=0,
        help_text="Pain level before exercise"
    )
    pain_level_after = models.PositiveSmallIntegerField(
        choices=PAIN_LEVEL_CHOICES,
        default=0,
        help_text="Pain level after exercise"
    )
    energy_level = models.PositiveSmallIntegerField(
        choices=[
            (1, 'Very Low'),
            (2, 'Low'),
            (3, 'Moderate'),
            (4, 'High'),
            (5, 'Very High'),
        ],
        default=3,
        help_text="Energy level during exercise"
    )
    mood_rating = models.PositiveSmallIntegerField(
        choices=[
            (1, 'Very Poor'),
            (2, 'Poor'),
            (3, 'Neutral'),
            (4, 'Good'),
            (5, 'Very Good'),
        ],
        default=3,
        help_text="Mood after exercise"
    )
    notes = models.TextField(
        blank=True, 
        null=True,
        help_text="Additional notes about the session"
    )
    side_effects = models.TextField(
        blank=True,
        null=True,
        help_text="Any side effects experienced"
    )
    modifications_made = models.TextField(
        blank=True,
        null=True,
        help_text="Any modifications made to the exercise"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'exercise_progress'
        ordering = ['-date_completed', '-created_at']
        verbose_name_plural = "Exercise Progress"
        indexes = [
            models.Index(fields=['patient', 'date_completed']),
            models.Index(fields=['exercise_plan_item', 'date_completed']),
            models.Index(fields=['completion_status']),
        ]
        unique_together = ['patient', 'exercise_plan_item', 'date_completed']
    
    def __str__(self):
        return f"Progress for {self.exercise_plan_item.exercise.name} on {self.date_completed}"
    
    @property
    def completion_percentage(self):
        """Calculate completion percentage based on target vs actual"""
        target_reps = self.exercise_plan_item.effective_repetitions
        target_sets = self.exercise_plan_item.effective_sets
        
        rep_percentage = (self.completed_repetitions / target_reps) * 100 if target_reps > 0 else 0
        set_percentage = (self.completed_sets / target_sets) * 100 if target_sets > 0 else 0
        
        return min(100, (rep_percentage + set_percentage) / 2)
    
    @property
    def pain_improvement(self):
        """Calculate pain improvement (positive = improvement)"""
        return self.pain_level_before - self.pain_level_after
