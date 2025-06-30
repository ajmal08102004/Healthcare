from django.contrib import admin
from .models import (
    ExerciseCategory, Exercise, ExercisePlan, 
    ExercisePlanItem, ExerciseProgress
)

@admin.register(ExerciseCategory)
class ExerciseCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active', 'sort_order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('sort_order', 'name')

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'difficulty', 'duration', 'is_active', 'created_by')
    list_filter = ('category', 'difficulty', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'instructions')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'instructions', 'category', 'difficulty')
        }),
        ('Exercise Details', {
            'fields': ('target_body_parts', 'duration', 'repetitions', 'sets', 'rest_time', 'calories_burned')
        }),
        ('Equipment & Safety', {
            'fields': ('equipment_needed', 'precautions', 'benefits')
        }),
        ('Media', {
            'fields': ('image', 'video_url')
        }),
        ('Status', {
            'fields': ('is_active', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class ExercisePlanItemInline(admin.TabularInline):
    model = ExercisePlanItem
    extra = 1
    fields = ('exercise', 'day_of_week', 'week_number', 'custom_repetitions', 'custom_sets', 'intensity_level', 'is_mandatory')

@admin.register(ExercisePlan)
class ExercisePlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'patient', 'physiotherapist', 'status', 'start_date', 'end_date', 'frequency_per_week')
    list_filter = ('status', 'start_date', 'end_date', 'frequency_per_week', 'created_at')
    search_fields = ('name', 'description', 'patient__username', 'physiotherapist__username')
    inlines = [ExercisePlanItemInline]
    readonly_fields = ('created_at', 'updated_at', 'progress_percentage')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'patient', 'physiotherapist')
        }),
        ('Plan Details', {
            'fields': ('start_date', 'end_date', 'status', 'goals', 'frequency_per_week', 'estimated_duration_weeks')
        }),
        ('Settings', {
            'fields': ('difficulty_progression', 'notes', 'is_active')
        }),
        ('Progress', {
            'fields': ('progress_percentage',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ExercisePlanItem)
class ExercisePlanItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'exercise_plan', 'exercise', 'day_of_week', 'week_number', 'intensity_level', 'is_mandatory')
    list_filter = ('day_of_week', 'week_number', 'intensity_level', 'is_mandatory')
    search_fields = ('exercise_plan__name', 'exercise__name', 'notes')

@admin.register(ExerciseProgress)
class ExerciseProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'exercise_plan_item', 'date_completed', 'completion_status', 'difficulty_rating', 'pain_level_before', 'pain_level_after')
    list_filter = ('completion_status', 'difficulty_rating', 'pain_level_before', 'pain_level_after', 'date_completed')
    search_fields = ('patient__username', 'exercise_plan_item__exercise__name', 'notes')
    date_hierarchy = 'date_completed'
    readonly_fields = ('created_at', 'updated_at', 'completion_percentage', 'pain_improvement')
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient', 'exercise_plan_item', 'date_completed', 'completion_status')
        }),
        ('Performance', {
            'fields': ('completed_repetitions', 'completed_sets', 'actual_duration', 'completion_percentage')
        }),
        ('Ratings', {
            'fields': ('difficulty_rating', 'pain_level_before', 'pain_level_after', 'pain_improvement', 'energy_level', 'mood_rating')
        }),
        ('Notes & Modifications', {
            'fields': ('notes', 'side_effects', 'modifications_made')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# Admin classes are registered using decorators above
