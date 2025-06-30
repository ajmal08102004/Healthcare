from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import PatientProfile, PhysiotherapistProfile, validate_strong_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    is_patient = serializers.ReadOnlyField()
    is_physiotherapist = serializers.ReadOnlyField()
    is_admin_user = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone_number', 'date_of_birth', 'address', 
            'profile_picture', 'is_verified', 'is_active_session',
            'is_patient', 'is_physiotherapist', 'is_admin_user',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'is_verified', 'is_active_session', 'created_at', 'updated_at',
            'full_name', 'is_patient', 'is_physiotherapist', 'is_admin_user'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with profile information"""
    patient_profile = serializers.SerializerMethodField()
    physiotherapist_profile = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone_number', 'date_of_birth', 'address', 
            'profile_picture', 'is_verified', 'is_active_session',
            'patient_profile', 'physiotherapist_profile',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_patient_profile(self, obj):
        if hasattr(obj, 'patient_profile') and obj.user_type == 'patient':
            return PatientProfileSerializer(obj.patient_profile).data
        return None
    
    def get_physiotherapist_profile(self, obj):
        if hasattr(obj, 'physiotherapist_profile') and obj.user_type == 'physiotherapist':
            return PhysiotherapistProfileSerializer(obj.physiotherapist_profile).data
        return None

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    bmi = serializers.SerializerMethodField()
    
    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user', 'medical_history', 'allergies', 'current_medications',
            'blood_type', 'height', 'weight', 'bmi',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
            'insurance_provider', 'insurance_number',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_bmi(self, obj):
        """Calculate BMI if height and weight are available"""
        if obj.height and obj.weight:
            height_m = float(obj.height) / 100  # Convert cm to meters
            return round(float(obj.weight) / (height_m ** 2), 2)
        return None

class PhysiotherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialization_display = serializers.ReadOnlyField()
    
    class Meta:
        model = PhysiotherapistProfile
        fields = [
            'id', 'user', 'license_number', 'specializations', 'specialization_display',
            'years_of_experience', 'education', 'certifications', 'consultation_fee',
            'is_available', 'bio', 'languages_spoken', 'clinic_address', 'working_hours',
            'rating', 'total_reviews',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['rating', 'total_reviews', 'created_at', 'updated_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password', 
            'first_name', 'last_name', 'user_type', 'phone_number', 
            'date_of_birth', 'address'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        """Validate username uniqueness and format"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        try:
            validate_strong_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        
        # Additional validation for physiotherapist registration
        if data.get('user_type') == 'physiotherapist':
            if not data.get('phone_number'):
                raise serializers.ValidationError({"phone_number": "Phone number is required for physiotherapists"})
        
        return data
    
    def create(self, validated_data):
        """Create user with appropriate profile"""
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
                license_number=f"TEMP-{user.id}",  # Temporary license number
                specializations=['general'],  # Default specialization
                languages_spoken=['English'],  # Default language
            )
        
        return user

class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Try to authenticate with username or email
            user = authenticate(username=username, password=password)
            if not user:
                # Try with email
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                data['user'] = user
            else:
                raise serializers.ValidationError("Invalid credentials.")
        else:
            raise serializers.ValidationError("Must include username and password.")
        
        return data

class PatientProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = [
            'medical_history', 'allergies', 'current_medications',
            'blood_type', 'height', 'weight',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
            'insurance_provider', 'insurance_number'
        ]
    
    def validate_height(self, value):
        """Validate height is reasonable"""
        if value and (value < 50 or value > 250):
            raise serializers.ValidationError("Height must be between 50 and 250 cm.")
        return value
    
    def validate_weight(self, value):
        """Validate weight is reasonable"""
        if value and (value < 20 or value > 300):
            raise serializers.ValidationError("Weight must be between 20 and 300 kg.")
        return value

class PhysiotherapistProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysiotherapistProfile
        fields = [
            'license_number', 'specializations', 'years_of_experience', 
            'education', 'certifications', 'consultation_fee', 'is_available',
            'bio', 'languages_spoken', 'clinic_address', 'working_hours'
        ]
    
    def validate_license_number(self, value):
        """Validate license number uniqueness"""
        instance = getattr(self, 'instance', None)
        if PhysiotherapistProfile.objects.filter(license_number=value).exclude(
            pk=instance.pk if instance else None
        ).exists():
            raise serializers.ValidationError("This license number is already in use.")
        return value
    
    def validate_consultation_fee(self, value):
        """Validate consultation fee is reasonable"""
        if value and (value < 0 or value > 10000):
            raise serializers.ValidationError("Consultation fee must be between 0 and 10000.")
        return value

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def validate_new_password(self, value):
        """Validate new password strength"""
        try:
            validate_strong_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match"})
        
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "New password must be different from old password"})
        
        return data

class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user basic information"""
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 
            'date_of_birth', 'address', 'profile_picture'
        ]
    
    def validate_phone_number(self, value):
        """Validate phone number format"""
        if value:
            # Use the model validator
            from .models import validate_phone_number
            validate_phone_number(value)
        return value