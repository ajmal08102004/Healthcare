from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import (
    ExerciseCategory, Exercise, ExercisePlan, 
    ExercisePlanItem, ExerciseProgress
)
from .serializers import (
    ExerciseCategorySerializer, ExerciseSerializer, 
    ExercisePlanSerializer, ExercisePlanCreateSerializer,
    ExercisePlanItemSerializer, ExerciseProgressSerializer,
    ExerciseProgressCreateSerializer
)

class ExerciseCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise categories.
    """
    queryset = ExerciseCategory.objects.all()
    serializer_class = ExerciseCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercises.
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'duration']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'difficulty', 'duration', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        """
        Only physiotherapists and admins can create/update/delete exercises.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """
        Only physiotherapists and admins can create exercises.
        """
        if request.user.user_type not in ['physiotherapist', 'admin'] and not request.user.is_superuser:
            return Response(
                {'error': 'Only physiotherapists and admins can create exercises'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Only physiotherapists and admins can update exercises.
        """
        if request.user.user_type not in ['physiotherapist', 'admin'] and not request.user.is_superuser:
            return Response(
                {'error': 'Only physiotherapists and admins can update exercises'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only physiotherapists and admins can delete exercises.
        """
        if request.user.user_type not in ['physiotherapist', 'admin'] and not request.user.is_superuser:
            return Response(
                {'error': 'Only physiotherapists and admins can delete exercises'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class ExercisePlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise plans.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'patient', 'physiotherapist']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'start_date', 'end_date', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExercisePlanCreateSerializer
        return ExercisePlanSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user type and permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return ExercisePlan.objects.all()
        elif user.user_type == 'patient':
            return ExercisePlan.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return ExercisePlan.objects.filter(physiotherapist=user)
        else:
            return ExercisePlan.objects.none()
    
    def perform_create(self, serializer):
        """
        Set the physiotherapist to the current user.
        """
        if self.request.user.user_type != 'physiotherapist':
            raise serializers.ValidationError("Only physiotherapists can create exercise plans")
        serializer.save(physiotherapist=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """
        Only the physiotherapist who created the plan can update it.
        """
        instance = self.get_object()
        if request.user != instance.physiotherapist and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update exercise plans you created'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only the physiotherapist who created the plan can delete it.
        """
        instance = self.get_object()
        if request.user != instance.physiotherapist and not request.user.is_superuser:
            return Response(
                {'error': 'You can only delete exercise plans you created'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_exercise(self, request, pk=None):
        """
        Add an exercise to the plan.
        """
        plan = self.get_object()
        
        # Only the physiotherapist who created the plan can add exercises
        if request.user != plan.physiotherapist and not request.user.is_superuser:
            return Response(
                {'error': 'You can only add exercises to plans you created'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ExercisePlanItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(exercise_plan=plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def exercises(self, request, pk=None):
        """
        Get all exercises in the plan.
        """
        plan = self.get_object()
        items = plan.plan_items.all()
        serializer = ExercisePlanItemSerializer(items, many=True)
        return Response(serializer.data)

class ExercisePlanItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise plan items.
    """
    serializer_class = ExercisePlanItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['exercise_plan', 'exercise', 'day_of_week']
    ordering_fields = ['day_of_week']
    ordering = ['day_of_week']
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return ExercisePlanItem.objects.all()
        elif user.user_type == 'patient':
            return ExercisePlanItem.objects.filter(exercise_plan__patient=user)
        elif user.user_type == 'physiotherapist':
            return ExercisePlanItem.objects.filter(exercise_plan__physiotherapist=user)
        else:
            return ExercisePlanItem.objects.none()
    
    def update(self, request, *args, **kwargs):
        """
        Only the physiotherapist who created the plan can update items.
        """
        instance = self.get_object()
        if request.user != instance.exercise_plan.physiotherapist and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update items in plans you created'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only the physiotherapist who created the plan can delete items.
        """
        instance = self.get_object()
        if request.user != instance.exercise_plan.physiotherapist and not request.user.is_superuser:
            return Response(
                {'error': 'You can only delete items from plans you created'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class ExerciseProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise progress.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['patient', 'exercise_plan_item', 'difficulty_rating', 'pain_level']
    ordering_fields = ['date_completed', 'created_at']
    ordering = ['-date_completed']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseProgressCreateSerializer
        return ExerciseProgressSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        user = self.request.user
        
        if user.is_superuser or user.user_type == 'admin':
            return ExerciseProgress.objects.all()
        elif user.user_type == 'patient':
            return ExerciseProgress.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            return ExerciseProgress.objects.filter(
                exercise_plan_item__exercise_plan__physiotherapist=user
            )
        else:
            return ExerciseProgress.objects.none()
    
    def perform_create(self, serializer):
        """
        Set the patient to the current user if they're a patient.
        """
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()
    
    def update(self, request, *args, **kwargs):
        """
        Only the patient who created the progress can update it.
        """
        instance = self.get_object()
        if request.user != instance.patient and not request.user.is_superuser:
            return Response(
                {'error': 'You can only update your own progress'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only the patient who created the progress can delete it.
        """
        instance = self.get_object()
        if request.user != instance.patient and not request.user.is_superuser:
            return Response(
                {'error': 'You can only delete your own progress'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)