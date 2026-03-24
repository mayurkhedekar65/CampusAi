from rest_framework import serializers
from .models import FeatureHistory

class FeatureHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureHistory
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
