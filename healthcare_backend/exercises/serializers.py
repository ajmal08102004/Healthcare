from rest_framework import serializers
from .models import (
    ExerciseCategory, Exercise, ExercisePlan, 
    ExercisePlanItem, ExerciseProgress
)
from authentication.serializers import UserSerializer

class ExerciseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseCategory
        fields = ['id', 'name', 'description']

class ExerciseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'description', 'category', 'category_name', 
                  'difficulty', 'duration', 'repetitions', 'sets', 
                  'video_url', 'image', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ExercisePlanItemSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(),
        write_only=True,
        source='exercise'
    )
    
    class Meta:
        model = ExercisePlanItem
        fields = ['id', 'exercise', 'exercise_id', 'day_of_week', 
                  'custom_repetitions', 'custom_sets', 'notes']

class ExercisePlanSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    physiotherapist = UserSerializer(read_only=True)
    plan_items = ExercisePlanItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExercisePlan
        fields = ['id', 'name', 'description', 'patient', 'physiotherapist', 
                  'plan_items', 'start_date', 'end_date', 'is_active', 
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ExercisePlanCreateSerializer(serializers.ModelSerializer):
    plan_items = ExercisePlanItemSerializer(many=True, required=False)
    
    class Meta:
        model = ExercisePlan
        fields = ['name', 'description', 'patient', 'start_date', 
                  'end_date', 'is_active', 'plan_items']
    
    def create(self, validated_data):
        plan_items_data = validated_data.pop('plan_items', [])
        
        # Set the physiotherapist to the current user
        validated_data['physiotherapist'] = self.context['request'].user
        
        # Create the exercise plan
        exercise_plan = ExercisePlan.objects.create(**validated_data)
        
        # Create plan items
        for item_data in plan_items_data:
            ExercisePlanItem.objects.create(exercise_plan=exercise_plan, **item_data)
        
        return exercise_plan

class ExerciseProgressSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise_plan_item.exercise.name', read_only=True)
    
    class Meta:
        model = ExerciseProgress
        fields = ['id', 'patient', 'exercise_plan_item', 'exercise_name', 
                  'date_completed', 'completed_repetitions', 'completed_sets', 
                  'difficulty_rating', 'pain_level', 'notes', 'created_at']
        read_only_fields = ['created_at']

class ExerciseProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProgress
        fields = ['exercise_plan_item', 'date_completed', 'completed_repetitions', 
                  'completed_sets', 'difficulty_rating', 'pain_level', 'notes']
    
    def create(self, validated_data):
        # Set the patient to the current user
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)