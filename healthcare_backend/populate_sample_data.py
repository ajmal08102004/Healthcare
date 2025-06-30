#!/usr/bin/env python
"""
Script to populate the database with sample data for testing the API endpoints.
"""
import os
import sys
import django
from datetime import date, time, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from authentication.models import PatientProfile, PhysiotherapistProfile
from appointments.models import Appointment, AppointmentFeedback
from exercises.models import ExerciseCategory, Exercise, ExercisePlan, ExercisePlanItem, ExerciseProgress


User = get_user_model()

def create_users():
    """Create sample users"""
    print("Creating users...")
    
    # Create patients
    patient1 = User.objects.create_user(
        username='patient1',
        email='patient1@example.com',
        password='password123',
        first_name='John',
        last_name='Doe',
        user_type='patient',
        phone_number='+1234567890',
        date_of_birth=date(1990, 5, 15)
    )
    
    patient2 = User.objects.create_user(
        username='patient2',
        email='patient2@example.com',
        password='password123',
        first_name='Jane',
        last_name='Smith',
        user_type='patient',
        phone_number='+1234567891',
        date_of_birth=date(1985, 8, 22)
    )
    
    # Create physiotherapists
    physio1 = User.objects.create_user(
        username='physio1',
        email='physio1@example.com',
        password='password123',
        first_name='Dr. Sarah',
        last_name='Johnson',
        user_type='physiotherapist',
        phone_number='+1234567892'
    )
    
    physio2 = User.objects.create_user(
        username='physio2',
        email='physio2@example.com',
        password='password123',
        first_name='Dr. Michael',
        last_name='Brown',
        user_type='physiotherapist',
        phone_number='+1234567893'
    )
    
    # Create patient profiles
    PatientProfile.objects.create(
        user=patient1,
        medical_history="Previous knee injury in 2020",
        emergency_contact_name="Mary Doe",
        emergency_contact_phone="+1234567894",
        insurance_provider="HealthCare Plus",
        insurance_number="HC123456789"
    )
    
    PatientProfile.objects.create(
        user=patient2,
        medical_history="Chronic back pain",
        emergency_contact_name="Bob Smith",
        emergency_contact_phone="+1234567895",
        insurance_provider="MediCare Pro",
        insurance_number="MP987654321"
    )
    
    # Create physiotherapist profiles
    PhysiotherapistProfile.objects.create(
        user=physio1,
        license_number="PT001234",
        specializations="Orthopedic, Sports Medicine, Manual Therapy",
        years_of_experience=8,
        education="DPT from University of Health Sciences",
        certifications="APTA Certified, Manual Therapy Certified",
        consultation_fee=150.00,
        is_available=True
    )
    
    PhysiotherapistProfile.objects.create(
        user=physio2,
        license_number="PT005678",
        specializations="Neurological, Pediatric, Geriatric",
        years_of_experience=12,
        education="DPT from Medical University",
        certifications="Neurological Rehabilitation Specialist",
        consultation_fee=175.00,
        is_available=True
    )
    
    print("Users created successfully!")
    return patient1, patient2, physio1, physio2

def create_appointments(patient1, patient2, physio1, physio2):
    """Create sample appointments"""
    print("Creating appointments...")
    
    today = timezone.now().date()
    
    # Past appointments
    apt1 = Appointment.objects.create(
        patient=patient1,
        physiotherapist=physio1,
        date=today - timedelta(days=7),
        start_time=time(10, 0),
        end_time=time(11, 0),
        status='completed',
        reason='Knee pain assessment and treatment',
        notes='Patient showed good progress. Recommended continued exercises.'
    )
    
    apt2 = Appointment.objects.create(
        patient=patient2,
        physiotherapist=physio2,
        date=today - timedelta(days=3),
        start_time=time(14, 0),
        end_time=time(15, 0),
        status='completed',
        reason='Back pain therapy session',
        notes='Significant improvement in mobility. Continue current treatment plan.'
    )
    
    # Future appointments
    Appointment.objects.create(
        patient=patient1,
        physiotherapist=physio1,
        date=today + timedelta(days=3),
        start_time=time(9, 0),
        end_time=time(10, 0),
        status='confirmed',
        reason='Follow-up knee therapy',
        notes=''
    )
    
    Appointment.objects.create(
        patient=patient2,
        physiotherapist=physio2,
        date=today + timedelta(days=5),
        start_time=time(15, 30),
        end_time=time(16, 30),
        status='scheduled',
        reason='Back pain follow-up',
        notes=''
    )
    
    # Create feedback for completed appointments
    AppointmentFeedback.objects.create(
        appointment=apt1,
        rating=5,
        comments='Excellent service! Dr. Johnson was very professional and helpful.'
    )
    
    AppointmentFeedback.objects.create(
        appointment=apt2,
        rating=4,
        comments='Good treatment, felt much better after the session.'
    )
    
    print("Appointments created successfully!")

def create_exercises():
    """Create sample exercises and categories"""
    print("Creating exercises...")
    
    # Create exercise categories
    ortho_cat = ExerciseCategory.objects.create(
        name="Orthopedic Rehabilitation",
        description="Exercises for bone, joint, and muscle rehabilitation"
    )
    
    cardio_cat = ExerciseCategory.objects.create(
        name="Cardiovascular",
        description="Exercises to improve cardiovascular health"
    )
    
    strength_cat = ExerciseCategory.objects.create(
        name="Strength Training",
        description="Exercises to build muscle strength and endurance"
    )
    
    # Create exercises
    Exercise.objects.create(
        name="Knee Flexion",
        description="Gentle knee bending exercise to improve range of motion",
        category=ortho_cat,
        difficulty='beginner',
        duration=10,
        repetitions=15,
        sets=3
    )
    
    Exercise.objects.create(
        name="Wall Push-ups",
        description="Modified push-ups against a wall for upper body strength",
        category=strength_cat,
        difficulty='beginner',
        duration=5,
        repetitions=10,
        sets=2
    )
    
    Exercise.objects.create(
        name="Walking",
        description="Low-impact cardiovascular exercise",
        category=cardio_cat,
        difficulty='beginner',
        duration=30,
        repetitions=1,
        sets=1
    )
    
    Exercise.objects.create(
        name="Squats",
        description="Lower body strengthening exercise",
        category=strength_cat,
        difficulty='intermediate',
        duration=8,
        repetitions=12,
        sets=3
    )
    
    Exercise.objects.create(
        name="Shoulder Rolls",
        description="Gentle shoulder mobility exercise",
        category=ortho_cat,
        difficulty='beginner',
        duration=5,
        repetitions=20,
        sets=2
    )
    
    print("Exercises created successfully!")

def create_exercise_plans(patient1, patient2, physio1, physio2):
    """Create sample exercise plans"""
    print("Creating exercise plans...")
    
    today = timezone.now().date()
    
    # Get exercises
    knee_flexion = Exercise.objects.get(name="Knee Flexion")
    wall_pushups = Exercise.objects.get(name="Wall Push-ups")
    walking = Exercise.objects.get(name="Walking")
    squats = Exercise.objects.get(name="Squats")
    
    # Create exercise plan for patient1
    plan1 = ExercisePlan.objects.create(
        name="Knee Rehabilitation Plan",
        description="Comprehensive plan for knee injury recovery",
        patient=patient1,
        physiotherapist=physio1,
        start_date=today,
        end_date=today + timedelta(days=30),
        is_active=True
    )
    
    # Add exercises to plan1
    item1 = ExercisePlanItem.objects.create(
        exercise_plan=plan1,
        exercise=knee_flexion,
        day_of_week=1,  # Tuesday
        custom_repetitions=20,
        custom_sets=3,
        notes="Focus on controlled movement"
    )
    
    ExercisePlanItem.objects.create(
        exercise_plan=plan1,
        exercise=walking,
        day_of_week=1,  # Tuesday
        custom_repetitions=1,
        custom_sets=1,
        notes="Start with 15 minutes, increase gradually"
    )
    
    ExercisePlanItem.objects.create(
        exercise_plan=plan1,
        exercise=knee_flexion,
        day_of_week=4,  # Friday
        custom_repetitions=20,
        custom_sets=3
    )
    
    # Create exercise plan for patient2
    plan2 = ExercisePlan.objects.create(
        name="Back Pain Relief Plan",
        description="Exercise plan to alleviate back pain and improve posture",
        patient=patient2,
        physiotherapist=physio2,
        start_date=today - timedelta(days=7),
        end_date=today + timedelta(days=23),
        is_active=True
    )
    
    # Add exercises to plan2
    ExercisePlanItem.objects.create(
        exercise_plan=plan2,
        exercise=wall_pushups,
        day_of_week=0,  # Monday
        custom_repetitions=8,
        custom_sets=2,
        notes="Keep core engaged"
    )
    
    ExercisePlanItem.objects.create(
        exercise_plan=plan2,
        exercise=walking,
        day_of_week=2,  # Wednesday
        custom_repetitions=1,
        custom_sets=1,
        notes="20-minute brisk walk"
    )
    
    ExercisePlanItem.objects.create(
        exercise_plan=plan2,
        exercise=squats,
        day_of_week=5,  # Saturday
        custom_repetitions=10,
        custom_sets=2,
        notes="Partial range if painful"
    )
    
    # Create some exercise progress
    ExerciseProgress.objects.create(
        patient=patient1,
        exercise_plan_item=item1,
        date_completed=today - timedelta(days=2),
        completed_repetitions=18,
        completed_sets=3,
        difficulty_rating=2,
        pain_level=1,
        notes="Felt good, slight discomfort at end range"
    )
    
    print("Exercise plans created successfully!")



def main():
    """Main function to populate all sample data"""
    print("Starting to populate sample data...")
    
    # Create users and profiles
    patient1, patient2, physio1, physio2 = create_users()
    
    # Create appointments
    create_appointments(patient1, patient2, physio1, physio2)
    
    # Create exercises and plans
    create_exercises()
    create_exercise_plans(patient1, patient2, physio1, physio2)
    
    print("\n" + "="*50)
    print("Sample data populated successfully!")
    print("="*50)
    print("\nTest accounts created:")
    print("Admin: admin / admin123")
    print("Patient 1: patient1 / password123")
    print("Patient 2: patient2 / password123")
    print("Physiotherapist 1: physio1 / password123")
    print("Physiotherapist 2: physio2 / password123")
    print("\nYou can now test the API endpoints!")

if __name__ == '__main__':
    main()