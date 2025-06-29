from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PatientProfile, PhysiotherapistProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_staff')
    list_filter = ('user_type', 'is_verified', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('user_type', 'phone_number', 'date_of_birth', 'address', 'profile_picture', 'is_verified')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('user_type', 'phone_number', 'date_of_birth', 'address', 'profile_picture', 'is_verified')}),
    )

class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'emergency_contact_name', 'insurance_provider')
    search_fields = ('user__username', 'user__email', 'emergency_contact_name')

class PhysiotherapistProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'years_of_experience', 'is_available')
    list_filter = ('is_available',)
    search_fields = ('user__username', 'user__email', 'license_number', 'specializations')

admin.site.register(User, CustomUserAdmin)
admin.site.register(PatientProfile, PatientProfileAdmin)
admin.site.register(PhysiotherapistProfile, PhysiotherapistProfileAdmin)
