from django.db import models
from django.conf import settings
from academics.models import Department


class Notification(models.Model):
    TYPE_CHOICES = (
        ('academic', 'Academic'),
        ('alert', 'Alert'),
        ('reminder', 'Reminder'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='academic')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_notifications')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='notifications')
    target_semester = models.IntegerField(null=True, blank=True, help_text="Null = all semesters")
    file = models.FileField(upload_to='notifications/files/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
