from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PatientProfile, PhysiotherapistProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 
                  'phone_number', 'date_of_birth', 'address', 'profile_picture', 'is_verified']
        read_only_fields = ['is_verified']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'medical_history', 'emergency_contact_name', 
                  'emergency_contact_phone', 'insurance_provider', 'insurance_number']

class PhysiotherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PhysiotherapistProfile
        fields = ['id', 'user', 'license_number', 'specializations', 'years_of_experience', 
                  'education', 'certifications', 'consultation_fee', 'is_available']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 
                  'last_name', 'user_type', 'phone_number', 'date_of_birth', 'address']
    
    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', 'patient'),
            phone_number=validated_data.get('phone_number', ''),
            date_of_birth=validated_data.get('date_of_birth', None),
            address=validated_data.get('address', '')
        )
        
        # Create corresponding profile based on user type
        if user.user_type == 'patient':
            PatientProfile.objects.create(user=user)
        elif user.user_type == 'physiotherapist':
            PhysiotherapistProfile.objects.create(
                user=user,
                license_number=f"TEMP-{user.id}"  # Temporary license number
            )
        
        return user

class PatientProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['medical_history', 'emergency_contact_name', 
                  'emergency_contact_phone', 'insurance_provider', 'insurance_number']

class PhysiotherapistProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysiotherapistProfile
        fields = ['license_number', 'specializations', 'years_of_experience', 
                  'education', 'certifications', 'consultation_fee', 'is_available']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match")
        return data