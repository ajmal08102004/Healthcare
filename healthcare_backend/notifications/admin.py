from django.contrib import admin
from .models import Notification, NotificationPreference

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__username', 'title', 'message')
    readonly_fields = ('created_at',)

class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'email_notifications', 'push_notifications', 
                    'appointment_reminders', 'message_notifications', 
                    'exercise_reminders', 'system_notifications')
    list_filter = ('email_notifications', 'push_notifications', 
                   'appointment_reminders', 'message_notifications', 
                   'exercise_reminders', 'system_notifications')
    search_fields = ('user__username',)

admin.site.register(Notification, NotificationAdmin)
admin.site.register(NotificationPreference, NotificationPreferenceAdmin)
