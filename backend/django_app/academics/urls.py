from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SubjectViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'subjects', SubjectViewSet, basename='subject')

urlpatterns = router.urls
