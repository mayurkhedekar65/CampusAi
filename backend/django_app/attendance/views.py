from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random
import math
from django.db.models import Count
from .models import AttendanceSession, Attendance
from academics.models import Subject
from .serializers import AttendanceSessionSerializer, AttendanceSerializer

# Haversine formula to calculate distance between two lat/long points
def calc_distance(lat1, lon1, lat2, lon2):
    if None in (lat1, lon1, lat2, lon2):
        return float('inf')
    R = 6371e3
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'TEACHER'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'STUDENT'

class StartSessionView(views.APIView):
    permission_classes = [IsTeacher]

    def post(self, request):
        subject_id = request.data.get('subject_id')
        lat = request.data.get('latitude')
        lon = request.data.get('longitude')
        try:
            subject = Subject.objects.get(id=subject_id, teacher=request.user)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)
        
        # Deactivate old sessions
        AttendanceSession.objects.filter(subject=subject, is_active=True).update(is_active=False)
        
        code = str(random.randint(1000, 9999))
        expires_at = timezone.now() + timedelta(seconds=20)
        
        session = AttendanceSession.objects.create(
            subject=subject, teacher=request.user, code=code, expires_at=expires_at,
            latitude=lat, longitude=lon, is_active=True
        )
        return Response({
            'session_id': session.id,
            'code': code,
            'expires_at': expires_at,
        }, status=status.HTTP_201_CREATED)

class VerifyAttendanceView(views.APIView):
    permission_classes = [IsStudent]

    def post(self, request):
        code = request.data.get('code')
        lat = request.data.get('latitude')
        lon = request.data.get('longitude')

        try:
            session = AttendanceSession.objects.get(code=code, is_active=True)
        except AttendanceSession.DoesNotExist:
            return Response({'error': 'Invalid or inactive session code'}, status=status.HTTP_400_BAD_REQUEST)
        
        if timezone.now() > session.expires_at:
            session.is_active = False
            session.save()
            return Response({'error': 'Session code has expired'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Optional GPS check (e.g. within 50 meters) if teacher coordinates exist
        if session.latitude and session.longitude and lat and lon:
            distance = calc_distance(float(session.latitude), float(session.longitude), float(lat), float(lon))
            if distance > 50:
                return Response({'error': f'GPS location not within allowed range (distance: {round(distance)}m)'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Attendance.objects.filter(student=request.user, session=session).exists():
            return Response({'error': 'Attendance already marked'}, status=status.HTTP_400_BAD_REQUEST)
            
        att = Attendance.objects.create(student=request.user, session=session)
        return Response({'message': 'Attendance marked successfully as PRESENT'}, status=status.HTTP_201_CREATED)

class StudentAttendanceView(views.APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        attendances = Attendance.objects.filter(student=request.user)
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data)

class SubjectAttendanceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subject_id = request.query_params.get('subject_id')
        if not subject_id:
            return Response({'error': 'subject_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Summary
        sessions = AttendanceSession.objects.filter(subject_id=subject_id).count()
        if request.user.role == 'STUDENT':
            attended = Attendance.objects.filter(student=request.user, session__subject_id=subject_id).count()
            return Response({'total_sessions': sessions, 'attended': attended})
            
        return Response({'error': 'Summary only for students currently'}, status=status.HTTP_400_BAD_REQUEST)

class AttendanceSummaryView(views.APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        user = request.user
        if not user.department or not user.semester:
            return Response({'error': 'Student must be enrolled in a department and semester'}, status=status.HTTP_400_BAD_REQUEST)
            
        subjects = Subject.objects.filter(department=user.department, semester=user.semester)
        
        subject_data = []
        total_overall = 0
        attended_overall = 0
        
        for sub in subjects:
            total_sessions = AttendanceSession.objects.filter(subject=sub).count()
            attended = Attendance.objects.filter(student=user, session__subject=sub).count()
            
            total_overall += total_sessions
            attended_overall += attended
            
            percentage = round((attended / total_sessions * 100), 1) if total_sessions > 0 else 0
            
            subject_data.append({
                'id': sub.id,
                'name': sub.name,
                'total': total_sessions,
                'attended': attended,
                'percentage': percentage,
                'status': 'low' if percentage < 75 else 'high'
            })
            
        overall_percentage = round((attended_overall / total_overall * 100), 1) if total_overall > 0 else 0
        
        return Response({
            'overall_percentage': overall_percentage,
            'subjects': subject_data
        })
