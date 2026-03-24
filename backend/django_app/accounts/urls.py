from django.urls import path
from .views import RegisterView, LoginView, ProfileView, StudentListView, UpdateStudentAcademicsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('students/', StudentListView.as_view(), name='students'),
    path('students/<int:pk>/', UpdateStudentAcademicsView.as_view(), name='update_student'),
]
