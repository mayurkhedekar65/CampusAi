from rest_framework import viewsets, permissions
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
