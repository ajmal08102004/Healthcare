from django.urls import path
from .views import (
    ExerciseCategoryListView, ExerciseListView, ExerciseDetailView,
    ExercisePlanListCreateView, ExercisePlanDetailView,
    ExercisePlanItemView, ExerciseProgressListCreateView
)

urlpatterns = [
    path('categories/', ExerciseCategoryListView.as_view(), name='exercise-category-list'),
    path('', ExerciseListView.as_view(), name='exercise-list'),
    path('<int:pk>/', ExerciseDetailView.as_view(), name='exercise-detail'),
    path('plans/', ExercisePlanListCreateView.as_view(), name='exercise-plan-list-create'),
    path('plans/<int:pk>/', ExercisePlanDetailView.as_view(), name='exercise-plan-detail'),
    path('plans/<int:plan_id>/items/', ExercisePlanItemView.as_view(), name='exercise-plan-item-create'),
    path('plans/<int:plan_id>/items/<int:item_id>/', ExercisePlanItemView.as_view(), name='exercise-plan-item-delete'),
    path('progress/', ExerciseProgressListCreateView.as_view(), name='exercise-progress-list-create'),
]