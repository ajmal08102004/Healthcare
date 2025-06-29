from django.contrib import admin
from .models import Appointment, AppointmentFeedback

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'physiotherapist', 'date', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'date')
    search_fields = ('patient__username', 'physiotherapist__username', 'reason')
    date_hierarchy = 'date'

class AppointmentFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'rating')
    list_filter = ('rating',)
    search_fields = ('appointment__patient__username', 'comments')

admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(AppointmentFeedback, AppointmentFeedbackAdmin)
