from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import DepartmentViewSet, SubjectViewSet, HODDashboardView, HODAssignSubjectView, HODSubjectListView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'subjects', SubjectViewSet, basename='subject')

urlpatterns = router.urls + [
    path('hod_dashboard/', HODDashboardView.as_view(), name='hod_dashboard'),
    path('hod_subjects/', HODSubjectListView.as_view(), name='hod_subjects'),
    path('hod_assign/', HODAssignSubjectView.as_view(), name='hod_assign'),
]

