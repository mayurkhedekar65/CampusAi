from rest_framework import serializers
from django.contrib.auth import get_user_model
from academics.models import Department

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'department', 'department_name', 'semester', 'cgpa', 'credits', 'password')
        extra_kwargs = {
            'department': {'required': False, 'allow_null': True},
            'semester': {'required': False, 'allow_null': True},
            'cgpa': {'required': False},
            'credits': {'required': False},
        }

    def get_department_name(self, obj):
        if obj.department:
            return obj.department.name
        return None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user
