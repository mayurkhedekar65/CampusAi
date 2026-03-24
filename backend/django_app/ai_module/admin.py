from django.contrib import admin
from .models import FeatureHistory

@admin.register(FeatureHistory)
class FeatureHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'feature_type', 'created_at')
    list_filter = ('feature_type', 'created_at')
    search_fields = ('user__email', 'user__name')
