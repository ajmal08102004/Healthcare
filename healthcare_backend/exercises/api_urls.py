from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    ExerciseCategoryViewSet, ExerciseViewSet, ExercisePlanViewSet,
    ExercisePlanItemViewSet, ExerciseProgressViewSet
)

router = DefaultRouter()
router.register(r'exercise-categories', ExerciseCategoryViewSet, basename='exercise-categories')
router.register(r'exercises', ExerciseViewSet, basename='exercises')
router.register(r'exercise-plans', ExercisePlanViewSet, basename='exercise-plans')
router.register(r'exercise-plan-items', ExercisePlanItemViewSet, basename='exercise-plan-items')
router.register(r'exercise-progress', ExerciseProgressViewSet, basename='exercise-progress')

urlpatterns = [
    path('', include(router.urls)),
]