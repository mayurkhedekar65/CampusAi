from django.db import models
from django.conf import settings

class FeatureHistory(models.Model):
    FEATURE_CHOICES = (
        ('APTITUDE', 'Aptitude Test'),
        ('ROADMAP', 'Roadmap Generation'),
        ('RESUME', 'Resume Review'),
        ('INTERVIEW', 'Mock Interview'),
        ('CHAT', 'AI Assistant Chat'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_histories')
    feature_type = models.CharField(max_length=20, choices=FEATURE_CHOICES)
    input_data = models.JSONField(help_text="The parameters or input text sent by the user")
    output_data = models.JSONField(help_text="The generated AI response or result")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.get_feature_type_display()} at {self.created_at.date()}"
