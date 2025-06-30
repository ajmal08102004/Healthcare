#!/usr/bin/env python
"""
Create sample data for Healthcare API testing
"""

import os
import django
from datetime import datetime, timedelta, time
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from authentication.models import PatientProfile, PhysiotherapistProfile
from appointments.models import Appointment, AppointmentFeedback
from exercises.models import ExerciseCategory, Exercise, ExercisePlan, ExercisePlanItem, ExerciseProgress
from notifications.models import Notification

User = get_user_model()

def create_sample_data():
    print("Creating sample data...")
    
    # Create users
    print("Creating users...")
    
    # Create patients
    patient1, created = User.objects.get_or_create(
        username='patient1',
        defaults={
            'email': 'patient1@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'user_type': 'patient',
            'phone_number': '+1234567890',
            'date_of_birth': '1990-01-15'
        }
    )
    if created:
        patient1.set_password('password123')
        patient1.save()
    
    patient2, created = User.objects.get_or_create(
        username='patient2',
        defaults={
            'email': 'patient2@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'user_type': 'patient',
            'phone_number': '+1234567891',
            'date_of_birth': '1985-05-20'
        }
    )
    if created:
        patient2.set_password('password123')
        patient2.save()
    
    # Create physiotherapists
    physio1, created = User.objects.get_or_create(
        username='physio1',
        defaults={
            'email': 'physio1@example.com',
            'first_name': 'Dr. Sarah',
            'last_name': 'Johnson',
            'user_type': 'physiotherapist',
            'phone_number': '+1234567892',
            'date_of_birth': '1980-03-10'
        }
    )
    if created:
        physio1.set_password('password123')
        physio1.save()
    
    physio2, created = User.objects.get_or_create(
        username='physio2',
        defaults={
            'email': 'physio2@example.com',
            'first_name': 'Dr. Michael',
            'last_name': 'Brown',
            'user_type': 'physiotherapist',
            'phone_number': '+1234567893',
            'date_of_birth': '1975-08-25'
        }
    )
    if created:
        physio2.set_password('password123')
        physio2.save()
    
    print("Creating profiles...")
    
    # Create patient profiles
    patient1_profile, created = PatientProfile.objects.get_or_create(
        user=patient1,
        defaults={
            'height': 175.0,
            'weight': 70.0,
            'blood_type': 'O+',
            'medical_history': 'Back pain, Previous knee surgery',
            'allergies': 'Penicillin',
            'current_medications': 'Ibuprofen',
            'emergency_contact_name': 'Mary Doe',
            'emergency_contact_phone': '+1234567894',
            'emergency_contact_relationship': 'Wife'
        }
    )
    
    patient2_profile, created = PatientProfile.objects.get_or_create(
        user=patient2,
        defaults={
            'height': 165.0,
            'weight': 60.0,
            'blood_type': 'A+',
            'medical_history': 'Shoulder injury',
            'allergies': '',
            'current_medications': '',
            'emergency_contact_name': 'Bob Smith',
            'emergency_contact_phone': '+1234567895',
            'emergency_contact_relationship': 'Husband'
        }
    )
    
    # Create physiotherapist profiles
    physio1_profile, created = PhysiotherapistProfile.objects.get_or_create(
        user=physio1,
        defaults={
            'license_number': 'PT12345',
            'specializations': ['Orthopedic', 'Sports Medicine'],
            'years_of_experience': 10,
            'education': 'DPT from University of Health Sciences',
            'certifications': ['Board Certified Orthopedic Specialist'],
            'clinic_address': '123 Health St, Medical City',
            'consultation_fee': 150.00,
            'rating': 4.8,
            'is_available': True
        }
    )
    
    physio2_profile, created = PhysiotherapistProfile.objects.get_or_create(
        user=physio2,
        defaults={
            'license_number': 'PT67890',
            'specializations': ['Neurological', 'Geriatric'],
            'years_of_experience': 15,
            'education': 'DPT from Medical University',
            'certifications': ['Neurologic Clinical Specialist'],
            'clinic_address': '456 Therapy Ave, Health District',
            'consultation_fee': 175.00,
            'rating': 4.9,
            'is_available': True
        }
    )
    
    print("Creating exercise categories and exercises...")
    
    # Create exercise categories
    strength_category, created = ExerciseCategory.objects.get_or_create(
        name='Strength Training',
        defaults={
            'description': 'Exercises focused on building muscle strength',
            'sort_order': 1
        }
    )
    
    flexibility_category, created = ExerciseCategory.objects.get_or_create(
        name='Flexibility & Stretching',
        defaults={
            'description': 'Exercises to improve flexibility and range of motion',
            'sort_order': 2
        }
    )
    
    cardio_category, created = ExerciseCategory.objects.get_or_create(
        name='Cardiovascular',
        defaults={
            'description': 'Exercises to improve cardiovascular health',
            'sort_order': 3
        }
    )
    
    # Create exercises
    exercise1, created = Exercise.objects.get_or_create(
        name='Wall Push-ups',
        defaults={
            'category': strength_category,
            'description': 'Modified push-ups performed against a wall',
            'instructions': 'Stand arm\'s length from wall, place palms flat against wall, push body away and back',
            'duration': 300,  # 5 minutes
            'repetitions': 15,
            'sets': 3,
            'difficulty': 'beginner',
            'target_body_parts': ['chest', 'arms', 'shoulders'],
            'benefits': ['Upper body strength', 'Core stability'],
            'precautions': ['Avoid if shoulder pain persists']
        }
    )
    
    exercise2, created = Exercise.objects.get_or_create(
        name='Hamstring Stretch',
        defaults={
            'category': flexibility_category,
            'description': 'Gentle stretch for hamstring muscles',
            'instructions': 'Sit on floor, extend one leg, reach toward toes',
            'duration': 180,  # 3 minutes
            'repetitions': 1,
            'sets': 3,
            'difficulty': 'beginner',
            'target_body_parts': ['hamstrings', 'lower back'],
            'benefits': ['Improved flexibility', 'Reduced muscle tension'],
            'precautions': ['Stop if sharp pain occurs']
        }
    )
    
    exercise3, created = Exercise.objects.get_or_create(
        name='Stationary Bike',
        defaults={
            'category': cardio_category,
            'description': 'Low-impact cardiovascular exercise',
            'instructions': 'Maintain steady pace, adjust resistance as needed',
            'duration': 1200,  # 20 minutes
            'repetitions': 1,
            'sets': 1,
            'difficulty': 'intermediate',
            'target_body_parts': ['legs', 'cardiovascular system'],
            'benefits': ['Improved endurance', 'Joint-friendly cardio'],
            'precautions': ['Start slowly, monitor heart rate']
        }
    )
    
    print("Creating appointments...")
    
    # Create appointments
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(days=7)
    
    appointment1 = Appointment.objects.create(
        patient=patient1,
        physiotherapist=physio1,
        date=tomorrow,
        start_time=time(10, 0),
        end_time=time(11, 0),
        appointment_type='initial_consultation',
        status='scheduled',
        reason='Back pain assessment',
        symptoms=['Lower back pain', 'Stiffness in morning'],
        payment_status='pending'
    )
    
    appointment2 = Appointment.objects.create(
        patient=patient2,
        physiotherapist=physio2,
        date=next_week,
        start_time=time(14, 0),
        end_time=time(15, 0),
        appointment_type='follow_up',
        status='confirmed',
        reason='Shoulder rehabilitation',
        symptoms=['Limited range of motion', 'Occasional pain'],
        payment_status='paid'
    )
    
    # Create a completed appointment for feedback
    past_appointment = Appointment.objects.create(
        patient=patient1,
        physiotherapist=physio1,
        date=today - timedelta(days=3),
        start_time=time(9, 0),
        end_time=time(10, 0),
        appointment_type='treatment',
        status='completed',
        reason='Back pain treatment',
        symptoms=['Lower back pain'],
        treatment_plan='Continue with prescribed exercises',
        notes='Patient showing good progress',
        payment_status='paid'
    )
    
    # Create appointment feedback
    feedback = AppointmentFeedback.objects.create(
        appointment=past_appointment,
        rating=5,
        comments='Excellent treatment, feeling much better!',
        would_recommend=True,
        treatment_effectiveness=5,
        punctuality_rating=5,
        professionalism_rating=4
    )
    
    print("Creating exercise plans...")
    
    # Create exercise plan
    exercise_plan = ExercisePlan.objects.create(
        name='Back Pain Recovery Plan',
        description='Comprehensive plan for lower back pain recovery',
        patient=patient1,
        physiotherapist=physio1,
        start_date=today,
        end_date=today + timedelta(days=30),
        frequency_per_week=3,
        status='active'
    )
    
    # Don't add exercises directly - create plan items instead
    
    # Create exercise plan items
    plan_item1 = ExercisePlanItem.objects.create(
        exercise_plan=exercise_plan,
        exercise=exercise1,
        day_of_week=0,  # Monday
        week_number=1,
        custom_sets=3,
        custom_repetitions=15,
        custom_duration=5,  # 5 minutes
        is_mandatory=True,
        notes='Focus on proper form'
    )
    
    plan_item2 = ExercisePlanItem.objects.create(
        exercise_plan=exercise_plan,
        exercise=exercise2,
        day_of_week=0,  # Monday
        week_number=1,
        custom_sets=3,
        custom_repetitions=1,
        custom_duration=3,  # 3 minutes
        is_mandatory=True,
        notes='Hold stretch for 30 seconds'
    )
    
    # Create exercise progress
    progress1 = ExerciseProgress.objects.create(
        patient=patient1,
        exercise_plan_item=plan_item1,
        date_completed=today - timedelta(days=1),
        completed_repetitions=15,
        completed_sets=3,
        completion_status='completed',
        difficulty_rating=3,
        pain_level_before=2,
        pain_level_after=1,
        notes='Felt good, no pain during exercise'
    )
    
    print("Creating notifications...")
    
    # Create notifications
    notification1 = Notification.objects.create(
        recipient=patient1,
        title='Upcoming Appointment',
        message=f'You have an appointment tomorrow at 10:00 AM with Dr. {physio1.first_name} {physio1.last_name}',
        notification_type='appointment',
        is_read=False
    )
    
    notification2 = Notification.objects.create(
        recipient=physio1,
        title='New Patient Feedback',
        message=f'You received a 5-star rating from {patient1.first_name} {patient1.last_name}',
        notification_type='message',
        is_read=False
    )
    
    print("Sample data created successfully!")
    print(f"Created {User.objects.count()} users")
    print(f"Created {PatientProfile.objects.count()} patient profiles")
    print(f"Created {PhysiotherapistProfile.objects.count()} physiotherapist profiles")
    print(f"Created {Appointment.objects.count()} appointments")
    print(f"Created {Exercise.objects.count()} exercises")
    print(f"Created {ExercisePlan.objects.count()} exercise plans")
    print(f"Created {Notification.objects.count()} notifications")

if __name__ == '__main__':
    create_sample_data()