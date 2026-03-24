from django.urls import path
from .views import StartSessionView, VerifyAttendanceView, StudentAttendanceView, SubjectAttendanceView, AttendanceSummaryView

urlpatterns = [
    path('start/', StartSessionView.as_view(), name='start'),
    path('verify/', VerifyAttendanceView.as_view(), name='verify'),
    path('student/', StudentAttendanceView.as_view(), name='student'),
    path('subject/', SubjectAttendanceView.as_view(), name='subject'),
    path('summary/', AttendanceSummaryView.as_view(), name='summary'),
]
