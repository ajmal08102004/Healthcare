import os
import django
import random
from datetime import datetime, timedelta, time

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from authentication.models import PatientProfile, PhysiotherapistProfile
from exercises.models import ExerciseCategory, Exercise
from django.utils import timezone

User = get_user_model()

def create_users():
    # Create patients
    for i in range(1, 6):
        username = f"patient{i}"
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=f"patient{i}@example.com",
                password="password123",
                first_name=f"Patient{i}",
                last_name="User",
                user_type="patient",
                is_verified=True
            )
            PatientProfile.objects.create(
                user=user,
                medical_history="No significant medical history",
                emergency_contact_name="Emergency Contact",
                emergency_contact_phone="123-456-7890",
                insurance_provider="Health Insurance Co.",
                insurance_number=f"INS-{i}00000"
            )
            print(f"Created patient: {username}")
    
    # Create physiotherapists
    specializations = [
        "Orthopedic Physical Therapy",
        "Neurological Physical Therapy",
        "Cardiopulmonary Physical Therapy",
        "Geriatric Physical Therapy",
        "Pediatric Physical Therapy",
        "Sports Physical Therapy"
    ]
    
    for i in range(1, 4):
        username = f"physio{i}"
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=f"physio{i}@example.com",
                password="password123",
                first_name=f"Physio{i}",
                last_name="Therapist",
                user_type="physiotherapist",
                is_verified=True
            )
            
            # Randomly select 2-3 specializations
            user_specializations = random.sample(specializations, random.randint(2, 3))
            
            PhysiotherapistProfile.objects.create(
                user=user,
                license_number=f"LIC-{i}00000",
                specializations=", ".join(user_specializations),
                years_of_experience=random.randint(1, 15),
                education="Bachelor of Physiotherapy, University of Health Sciences",
                certifications="Certified Physical Therapist",
                consultation_fee=random.randint(50, 150),
                is_available=True
            )
            print(f"Created physiotherapist: {username}")

def create_exercise_categories():
    categories = [
        {"name": "Strength Training", "description": "Exercises focused on building muscle strength"},
        {"name": "Flexibility", "description": "Exercises to improve range of motion and flexibility"},
        {"name": "Balance", "description": "Exercises to improve stability and balance"},
        {"name": "Cardiovascular", "description": "Exercises to improve heart and lung health"},
        {"name": "Rehabilitation", "description": "Exercises for recovery from injury or surgery"}
    ]
    
    for category_data in categories:
        if not ExerciseCategory.objects.filter(name=category_data["name"]).exists():
            ExerciseCategory.objects.create(**category_data)
            print(f"Created exercise category: {category_data['name']}")

def create_exercises():
    exercises = [
        {
            "name": "Squats",
            "description": "Stand with feet shoulder-width apart, then bend knees and lower body as if sitting in a chair. Keep back straight and knees over toes.",
            "category": "Strength Training",
            "difficulty": "beginner",
            "duration": 10,
            "repetitions": 10,
            "sets": 3
        },
        {
            "name": "Lunges",
            "description": "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Front knee should be over ankle, not pushed out too far.",
            "category": "Strength Training",
            "difficulty": "intermediate",
            "duration": 15,
            "repetitions": 12,
            "sets": 3
        },
        {
            "name": "Hamstring Stretch",
            "description": "Sit on the floor with one leg extended and the other bent. Reach toward toes of extended leg, feeling stretch in hamstring.",
            "category": "Flexibility",
            "difficulty": "beginner",
            "duration": 5,
            "repetitions": 1,
            "sets": 3
        },
        {
            "name": "Single Leg Balance",
            "description": "Stand on one leg with the other leg lifted. Hold position, focusing on a point in front of you for balance.",
            "category": "Balance",
            "difficulty": "beginner",
            "duration": 5,
            "repetitions": 1,
            "sets": 2
        },
        {
            "name": "Walking",
            "description": "Brisk walking at a moderate pace to increase heart rate and improve cardiovascular health.",
            "category": "Cardiovascular",
            "difficulty": "beginner",
            "duration": 30,
            "repetitions": 1,
            "sets": 1
        },
        {
            "name": "Ankle Rotations",
            "description": "Rotate ankle in clockwise and counterclockwise directions to improve mobility after injury.",
            "category": "Rehabilitation",
            "difficulty": "beginner",
            "duration": 5,
            "repetitions": 10,
            "sets": 2
        }
    ]
    
    for exercise_data in exercises:
        category_name = exercise_data.pop("category")
        category = ExerciseCategory.objects.get(name=category_name)
        
        if not Exercise.objects.filter(name=exercise_data["name"]).exists():
            Exercise.objects.create(category=category, **exercise_data)
            print(f"Created exercise: {exercise_data['name']}")

if __name__ == "__main__":
    print("Starting database population...")
    create_users()
    create_exercise_categories()
    create_exercises()
    print("Database population completed!")