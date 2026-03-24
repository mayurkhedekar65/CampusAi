from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='created_by.name', read_only=True)
    creator_role = serializers.CharField(source='created_by.role', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_by', 'department']
