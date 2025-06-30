from django.contrib import admin
from .models import Appointment, AppointmentFeedback, AppointmentDocument

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'physiotherapist', 'date', 'start_time', 'end_time', 'status', 'appointment_type', 'cost', 'payment_status')
    list_filter = ('status', 'appointment_type', 'payment_status', 'date', 'created_at')
    search_fields = ('patient__username', 'physiotherapist__username', 'reason', 'symptoms')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at', 'duration', 'is_upcoming', 'can_be_cancelled')
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient', 'physiotherapist', 'date', 'start_time', 'end_time', 'status', 'appointment_type')
        }),
        ('Details', {
            'fields': ('reason', 'symptoms', 'notes', 'treatment_plan', 'prescription')
        }),
        ('Financial', {
            'fields': ('cost', 'payment_status')
        }),
        ('Follow-up', {
            'fields': ('next_appointment_recommended', 'reminder_sent')
        }),
        ('Cancellation', {
            'fields': ('cancelled_by', 'cancellation_reason'),
            'classes': ('collapse',)
        }),
        ('Computed Fields', {
            'fields': ('duration', 'is_upcoming', 'can_be_cancelled'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AppointmentFeedback)
class AppointmentFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'rating', 'punctuality_rating', 'professionalism_rating', 'treatment_effectiveness', 'would_recommend', 'created_at')
    list_filter = ('rating', 'punctuality_rating', 'professionalism_rating', 'treatment_effectiveness', 'would_recommend', 'created_at')
    search_fields = ('appointment__patient__username', 'appointment__physiotherapist__username', 'comments')
    readonly_fields = ('created_at', 'updated_at', 'average_rating')
    fieldsets = (
        ('Appointment', {
            'fields': ('appointment',)
        }),
        ('Ratings', {
            'fields': ('rating', 'punctuality_rating', 'professionalism_rating', 'treatment_effectiveness', 'average_rating')
        }),
        ('Feedback', {
            'fields': ('comments', 'would_recommend')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AppointmentDocument)
class AppointmentDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'document_type', 'title', 'uploaded_by', 'is_confidential', 'created_at')
    list_filter = ('document_type', 'is_confidential', 'created_at')
    search_fields = ('title', 'appointment__patient__username', 'appointment__physiotherapist__username')
    readonly_fields = ('created_at',)
