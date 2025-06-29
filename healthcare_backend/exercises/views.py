from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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

class ExerciseCategoryListView(generics.ListAPIView):
    queryset = ExerciseCategory.objects.all()
    serializer_class = ExerciseCategorySerializer
    permission_classes = [IsAuthenticated]

class ExerciseListView(generics.ListAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Exercise.objects.all()
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
            
        # Filter by difficulty if provided
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
            
        return queryset

class ExerciseDetailView(generics.RetrieveAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]

class ExercisePlanListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.user_type == 'patient':
            plans = ExercisePlan.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            plans = ExercisePlan.objects.filter(physiotherapist=user)
        else:
            plans = ExercisePlan.objects.all()
            
        # Filter by active status if provided
        is_active = request.query_params.get('is_active', None)
        if is_active is not None:
            is_active = is_active.lower() == 'true'
            plans = plans.filter(is_active=is_active)
            
        serializer = ExercisePlanSerializer(plans, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Only physiotherapists can create exercise plans
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can create exercise plans'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ExercisePlanCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            plan = serializer.save()
            return Response(
                ExercisePlanSerializer(plan).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExercisePlanDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_exercise_plan(self, pk, user):
        plan = get_object_or_404(ExercisePlan, pk=pk)
        
        # Check if user has permission to access this plan
        if user.user_type == 'patient' and plan.patient != user:
            self.permission_denied(self.request)
        elif user.user_type == 'physiotherapist' and plan.physiotherapist != user:
            self.permission_denied(self.request)
            
        return plan
    
    def get(self, request, pk):
        plan = self.get_exercise_plan(pk, request.user)
        serializer = ExercisePlanSerializer(plan)
        return Response(serializer.data)
    
    def put(self, request, pk):
        plan = self.get_exercise_plan(pk, request.user)
        
        # Only physiotherapists can update exercise plans
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can update exercise plans'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ExercisePlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            updated_plan = serializer.save()
            return Response(ExercisePlanSerializer(updated_plan).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        plan = self.get_exercise_plan(pk, request.user)
        
        # Only physiotherapists can delete exercise plans
        if request.user.user_type != 'physiotherapist':
            return Response(
                {'error': 'Only physiotherapists can delete exercise plans'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ExercisePlanItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, plan_id):
        # Get the exercise plan
        plan = get_object_or_404(ExercisePlan, pk=plan_id)
        
        # Only the physiotherapist who created the plan can add items
        if request.user != plan.physiotherapist:
            return Response(
                {'error': 'You do not have permission to add items to this plan'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ExercisePlanItemSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save(exercise_plan=plan)
            return Response(
                ExercisePlanItemSerializer(item).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, plan_id, item_id):
        # Get the exercise plan
        plan = get_object_or_404(ExercisePlan, pk=plan_id)
        
        # Only the physiotherapist who created the plan can delete items
        if request.user != plan.physiotherapist:
            return Response(
                {'error': 'You do not have permission to delete items from this plan'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        item = get_object_or_404(ExercisePlanItem, pk=item_id, exercise_plan=plan)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ExerciseProgressListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.user_type == 'patient':
            progress = ExerciseProgress.objects.filter(patient=user)
        elif user.user_type == 'physiotherapist':
            # Physiotherapists can see progress for their patients' exercise plans
            progress = ExerciseProgress.objects.filter(
                exercise_plan_item__exercise_plan__physiotherapist=user
            )
        else:
            progress = ExerciseProgress.objects.all()
            
        serializer = ExerciseProgressSerializer(progress, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Only patients can record exercise progress
        if request.user.user_type != 'patient':
            return Response(
                {'error': 'Only patients can record exercise progress'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ExerciseProgressCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            progress = serializer.save()
            return Response(
                ExerciseProgressSerializer(progress).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
