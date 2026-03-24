from rest_framework import serializers
from .models import Notes

class NotesSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    uploader_name = serializers.CharField(source='uploaded_by.name', read_only=True)

    class Meta:
        model = Notes
        fields = '__all__'
        read_only_fields = ['uploaded_by']
