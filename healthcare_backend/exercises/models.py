from django.db import models
from django.conf import settings

class ExerciseCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Exercise Categories"

class Exercise(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(ExerciseCategory, on_delete=models.CASCADE, related_name='exercises')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    repetitions = models.PositiveIntegerField(default=1)
    sets = models.PositiveIntegerField(default=1)
    video_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='exercise_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class ExercisePlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exercise_plans')
    physiotherapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_exercise_plans')
    exercises = models.ManyToManyField(Exercise, through='ExercisePlanItem')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} for {self.patient.username}"

class ExercisePlanItem(models.Model):
    exercise_plan = models.ForeignKey(ExercisePlan, on_delete=models.CASCADE, related_name='plan_items')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField(choices=(
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ))
    custom_repetitions = models.PositiveIntegerField(null=True, blank=True)
    custom_sets = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.exercise.name} on {self.get_day_of_week_display()}"
    
    class Meta:
        ordering = ['day_of_week']

class ExerciseProgress(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exercise_progress')
    exercise_plan_item = models.ForeignKey(ExercisePlanItem, on_delete=models.CASCADE, related_name='progress')
    date_completed = models.DateField()
    completed_repetitions = models.PositiveIntegerField()
    completed_sets = models.PositiveIntegerField()
    difficulty_rating = models.PositiveSmallIntegerField(choices=(
        (1, 'Very Easy'),
        (2, 'Easy'),
        (3, 'Moderate'),
        (4, 'Hard'),
        (5, 'Very Hard'),
    ))
    pain_level = models.PositiveSmallIntegerField(choices=(
        (0, 'No Pain'),
        (1, 'Mild'),
        (2, 'Moderate'),
        (3, 'Severe'),
        (4, 'Very Severe'),
    ))
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Progress for {self.exercise_plan_item.exercise.name} on {self.date_completed}"
    
    class Meta:
        ordering = ['-date_completed']
        verbose_name_plural = "Exercise Progress"
