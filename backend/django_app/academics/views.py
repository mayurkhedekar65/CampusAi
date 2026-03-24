from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, Subject
from .serializers import DepartmentSerializer, SubjectSerializer

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
            self.permission_classes = [permissions.IsAuthenticated]
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
        if department:
            qs = qs.filter(department_id=department)
        return qs

    @action(detail=False, methods=['get'])
    def my_subjects(self, request):
        user = request.user
        qs = self.get_queryset()
        
        if user.role == 'STUDENT':
            # Students see subjects for their department and semester
            if user.department and user.semester:
                qs = qs.filter(department=user.department, semester=user.semester)
            else:
                qs = qs.none()
        elif user.role == 'TEACHER':
            # Teachers see subjects they teach
            qs = qs.filter(teacher=user)
        # HOD sees all, so no extra filter
        
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
