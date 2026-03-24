from rest_framework import serializers
from .models import AttendanceSession, Attendance

class AttendanceSessionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = AttendanceSession
        fields = '__all__'
        read_only_fields = ['teacher', 'expires_at', 'code', 'is_active']

class AttendanceSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='session.subject.name', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['student', 'session', 'status']
