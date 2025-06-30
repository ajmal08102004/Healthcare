from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count, Avg, Sum
from datetime import datetime, timedelta
from .models import ExerciseCategory, Exercise, ExercisePlan, ExercisePlanItem, ExerciseProgress
from .serializers import (
    ExerciseCategorySerializer, ExerciseSerializer, ExercisePlanSerializer,
    ExercisePlanItemSerializer, ExerciseProgressSerializer,
    ExercisePlanCreateSerializer, ExerciseProgressCreateSerializer
)

class ExerciseCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise categories
    """
    serializer_class = ExerciseCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ExerciseCategory.objects.filter(is_active=True).order_by('sort_order', 'name')

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercises
    """
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Exercise.objects.filter(is_active=True).select_related('category', 'created_by')
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Search by name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(instructions__icontains=search)
            )
        
        return queryset.order_by('name')
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular exercises based on usage in plans"""
        exercises = self.get_queryset().annotate(
            usage_count=Count('exerciseplanitem')
        ).filter(usage_count__gt=0).order_by('-usage_count')[:10]
        
        serializer = self.get_serializer(exercises, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_body_part(self, request):
        """Get exercises grouped by target body parts"""
        body_part = request.query_params.get('body_part')
        if not body_part:
            return Response({'error': 'body_part parameter required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        exercises = self.get_queryset().filter(
            target_body_parts__icontains=body_part
        )
        serializer = self.get_serializer(exercises, many=True)
        return Response(serializer.data)

class ExercisePlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise plans
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExercisePlanCreateSerializer
        return ExercisePlanSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ExercisePlan.objects.select_related(
            'patient', 'physiotherapist'
        ).prefetch_related('items__exercise', 'progress_records')
        
        if user.user_type == 'patient':
            queryset = queryset.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(physiotherapist=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'physiotherapist':
            serializer.save(physiotherapist=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active exercise plans"""
        queryset = self.get_queryset().filter(status='active', is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate an exercise plan"""
        plan = self.get_object()
        
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can activate plans'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        plan.status = 'active'
        plan.save()
        
        serializer = self.get_serializer(plan)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark exercise plan as completed"""
        plan = self.get_object()
        
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can complete plans'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        plan.status = 'completed'
        plan.save()
        
        serializer = self.get_serializer(plan)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def progress_summary(self, request, pk=None):
        """Get progress summary for the plan"""
        plan = self.get_object()
        
        total_items = plan.items.count()
        completed_progress = ExerciseProgress.objects.filter(
            exercise_plan_item__exercise_plan=plan,
            completion_status='completed'
        ).count()
        
        progress_percentage = (completed_progress / total_items * 100) if total_items > 0 else 0
        
        # Get recent progress
        recent_progress = ExerciseProgress.objects.filter(
            exercise_plan_item__exercise_plan=plan
        ).order_by('-date_completed')[:5]
        
        progress_data = ExerciseProgressSerializer(recent_progress, many=True).data
        
        return Response({
            'total_exercises': total_items,
            'completed_sessions': completed_progress,
            'progress_percentage': round(progress_percentage, 2),
            'recent_progress': progress_data
        })

class ExercisePlanItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise plan items
    """
    serializer_class = ExercisePlanItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = ExercisePlanItem.objects.select_related(
            'exercise_plan__patient', 'exercise_plan__physiotherapist', 'exercise'
        )
        
        if user.user_type == 'patient':
            queryset = queryset.filter(exercise_plan__patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(exercise_plan__physiotherapist=user)
        
        # Filter by exercise plan
        plan_id = self.request.query_params.get('plan')
        if plan_id:
            queryset = queryset.filter(exercise_plan_id=plan_id)
        
        # Filter by day of week
        day = self.request.query_params.get('day')
        if day:
            queryset = queryset.filter(day_of_week=day)
        
        return queryset.order_by('day_of_week', 'exercise__name')
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's exercise plan items"""
        today = timezone.now().weekday()  # 0=Monday, 6=Sunday
        day_mapping = {
            0: 'monday', 1: 'tuesday', 2: 'wednesday', 3: 'thursday',
            4: 'friday', 5: 'saturday', 6: 'sunday'
        }
        
        queryset = self.get_queryset().filter(
            day_of_week=day_mapping.get(today),
            exercise_plan__status='active'
        )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ExerciseProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exercise progress
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseProgressCreateSerializer
        return ExerciseProgressSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ExerciseProgress.objects.select_related(
            'patient', 'exercise_plan_item__exercise', 'exercise_plan_item__exercise_plan'
        )
        
        if user.user_type == 'patient':
            queryset = queryset.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            queryset = queryset.filter(exercise_plan_item__exercise_plan__physiotherapist=user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date_completed__gte=start_date)
        if end_date:
            queryset = queryset.filter(date_completed__lte=end_date)
        
        # Filter by exercise plan
        plan_id = self.request.query_params.get('plan')
        if plan_id:
            queryset = queryset.filter(exercise_plan_item__exercise_plan_id=plan_id)
        
        return queryset.order_by('-date_completed')
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get exercise progress statistics"""
        queryset = self.get_queryset()
        
        # Basic stats
        total_sessions = queryset.count()
        completed_sessions = queryset.filter(completion_status='completed').count()
        
        # Average ratings
        avg_difficulty = queryset.aggregate(Avg('difficulty_rating'))['difficulty_rating__avg'] or 0
        avg_pain_before = queryset.aggregate(Avg('pain_level_before'))['pain_level_before__avg'] or 0
        avg_pain_after = queryset.aggregate(Avg('pain_level_after'))['pain_level_after__avg'] or 0
        
        # Weekly progress
        week_start = timezone.now().date() - timedelta(days=timezone.now().weekday())
        week_end = week_start + timedelta(days=6)
        weekly_sessions = queryset.filter(
            date_completed__range=[week_start, week_end]
        ).count()
        
        # Monthly progress
        month_start = timezone.now().date().replace(day=1)
        monthly_sessions = queryset.filter(
            date_completed__gte=month_start
        ).count()
        
        return Response({
            'total_sessions': total_sessions,
            'completed_sessions': completed_sessions,
            'completion_rate': (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
            'average_difficulty_rating': round(avg_difficulty, 2),
            'average_pain_before': round(avg_pain_before, 2),
            'average_pain_after': round(avg_pain_after, 2),
            'pain_improvement': round(avg_pain_before - avg_pain_after, 2),
            'weekly_sessions': weekly_sessions,
            'monthly_sessions': monthly_sessions
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent exercise progress"""
        queryset = self.get_queryset()[:10]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
