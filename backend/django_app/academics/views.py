from rest_framework import viewsets, permissions, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status
from .models import Department, Subject
from .serializers import DepartmentSerializer, SubjectSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class IsHOD(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'HOD'


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsHOD]
        else:
            # Allow unauthenticated access to list/retrieve (needed for signup form)
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.select_related('department', 'teacher').all()
    serializer_class = SubjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsHOD]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        department = self.request.query_params.get('department_id')
        semester = self.request.query_params.get('semester')
        if department:
            qs = qs.filter(department_id=department)
        if semester:
            qs = qs.filter(semester=semester)
        return qs

    @action(detail=False, methods=['get'])
    def my_subjects(self, request):
        user = request.user
        qs = self.get_queryset()
        
        if user.role == 'STUDENT':
            if user.department and user.semester:
                qs = qs.filter(department=user.department, semester=user.semester)
            else:
                qs = qs.none()
        elif user.role == 'TEACHER':
            qs = qs.filter(teacher=user)
        elif user.role == 'HOD':
            if user.department:
                qs = qs.filter(department=user.department)
        
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class HODDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'HOD':
            return Response({'error': 'Only HOD can access this'}, status=drf_status.HTTP_403_FORBIDDEN)

        if not user.department:
            return Response({'error': 'HOD not assigned to a department'}, status=drf_status.HTTP_400_BAD_REQUEST)

        dept = user.department

        total_subjects = Subject.objects.filter(department=dept).count()
        assigned_subjects = Subject.objects.filter(department=dept, teacher__isnull=False).count()
        unassigned_subjects = total_subjects - assigned_subjects

        total_teachers = User.objects.filter(role='TEACHER', department=dept).count()
        total_students = User.objects.filter(role='STUDENT', department=dept).count()

        # Teachers in THIS department (for statistics)
        dept_teachers = list(User.objects.filter(role='TEACHER', department=dept).values('id', 'name', 'email'))

        # ALL teachers in the system (for HOD assignment - so they can assign any teacher)
        all_teachers = list(User.objects.filter(role='TEACHER').values('id', 'name', 'email', 'department_id'))

        return Response({
            'department': dept.name,
            'total_subjects': total_subjects,
            'assigned_subjects': assigned_subjects,
            'unassigned_subjects': unassigned_subjects,
            'total_teachers': total_teachers,
            'total_students': total_students,
            'teachers': dept_teachers,       # dept teachers for display
            'all_teachers': all_teachers,    # all teachers for assignment dropdown
        })


class HODAssignSubjectView(views.APIView):
    """
    HOD types a subject name + semester, picks a teacher → creates or gets the subject,
    then assigns (or unassigns) the teacher. One endpoint for the whole flow.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'HOD':
            return Response({'error': 'Only HOD can assign subjects'}, status=drf_status.HTTP_403_FORBIDDEN)
        if not user.department:
            return Response({'error': 'HOD not assigned to a department'}, status=drf_status.HTTP_400_BAD_REQUEST)

        subject_name = request.data.get('subject_name', '').strip()
        semester = request.data.get('semester')
        teacher_id = request.data.get('teacher_id')

        if not subject_name:
            return Response({'error': 'subject_name is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        if not semester:
            return Response({'error': 'semester is required'}, status=drf_status.HTTP_400_BAD_REQUEST)

        # Get or create the subject in this department (case-insensitive name match)
        try:
            subject = Subject.objects.get(
                name__iexact=subject_name,
                department=user.department,
                semester=int(semester)
            )
            created = False
        except Subject.DoesNotExist:
            subject = Subject.objects.create(
                name=subject_name,
                department=user.department,
                semester=int(semester)
            )
            created = True

        # Assign or unassign teacher
        if teacher_id:
            try:
                teacher = User.objects.get(pk=teacher_id, role='TEACHER', department=user.department)
                subject.teacher = teacher
            except User.DoesNotExist:
                return Response({'error': 'Teacher not found in your department'}, status=drf_status.HTTP_404_NOT_FOUND)
        else:
            subject.teacher = None

        subject.save()
        serializer = SubjectSerializer(subject)
        return Response({**serializer.data, 'created': created}, status=drf_status.HTTP_201_CREATED if created else drf_status.HTTP_200_OK)


class HODSubjectListView(views.APIView):
    """List all subjects in HOD's department, optionally filtered by semester."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'HOD':
            return Response({'error': 'Only HOD'}, status=drf_status.HTTP_403_FORBIDDEN)
        if not user.department:
            return Response([])

        qs = Subject.objects.filter(department=user.department).select_related('teacher')
        semester = request.query_params.get('semester')
        if semester:
            qs = qs.filter(semester=semester)

        serializer = SubjectSerializer(qs, many=True)
        return Response(serializer.data)

    def delete(self, request):
        """Delete a subject (HOD only)."""
        user = request.user
        if user.role != 'HOD':
            return Response({'error': 'Only HOD'}, status=drf_status.HTTP_403_FORBIDDEN)
        subject_id = request.data.get('subject_id')
        try:
            subject = Subject.objects.get(pk=subject_id, department=user.department)
            subject.delete()
            return Response({'success': True})
        except Subject.DoesNotExist:
            return Response({'error': 'Not found'}, status=drf_status.HTTP_404_NOT_FOUND)


