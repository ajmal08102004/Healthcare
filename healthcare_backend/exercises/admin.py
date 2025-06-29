from django.contrib import admin
from .models import (
    ExerciseCategory, Exercise, ExercisePlan, 
    ExercisePlanItem, ExerciseProgress
)

class ExerciseCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name', 'description')

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'difficulty', 'duration')
    list_filter = ('category', 'difficulty')
    search_fields = ('name', 'description')

class ExercisePlanItemInline(admin.TabularInline):
    model = ExercisePlanItem
    extra = 1

class ExercisePlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'patient', 'physiotherapist', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('name', 'description', 'patient__username', 'physiotherapist__username')
    inlines = [ExercisePlanItemInline]

class ExercisePlanItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'exercise_plan', 'exercise', 'day_of_week')
    list_filter = ('day_of_week',)
    search_fields = ('exercise_plan__name', 'exercise__name', 'notes')

class ExerciseProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'exercise_plan_item', 'date_completed', 'difficulty_rating', 'pain_level')
    list_filter = ('difficulty_rating', 'pain_level', 'date_completed')
    search_fields = ('patient__username', 'exercise_plan_item__exercise__name', 'notes')
    date_hierarchy = 'date_completed'

admin.site.register(ExerciseCategory, ExerciseCategoryAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(ExercisePlan, ExercisePlanAdmin)
admin.site.register(ExercisePlanItem, ExercisePlanItemAdmin)
admin.site.register(ExerciseProgress, ExerciseProgressAdmin)
