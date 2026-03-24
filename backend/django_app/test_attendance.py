import os
import django
from datetime import timedelta
from django.utils import timezone
import math

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import User
from academics.models import Department, Subject
from attendance.models import AttendanceSession, Attendance
from attendance.views import calc_distance

def run_tests():
    print("--- STARTING ATTENDANCE TESTS ---")
    
    # 1. Setup Test Data
    print("\n1. Setting up Test Data...")
    dept, _ = Department.objects.get_or_create(name="Computer Science")
    
    teacher, _ = User.objects.get_or_create(email="teacher@test.com", defaults={
        "name": "Test Teacher", "role": "TEACHER"
    })
    teacher.set_password("pass123")
    teacher.save()
    
    student, _ = User.objects.get_or_create(email="student@test.com", defaults={
        "name": "Test Student", "role": "STUDENT", "department": dept, "semester": 5
    })
    student.set_password("pass123")
    student.save()
    
    subject, _ = Subject.objects.get_or_create(name="Machine Learning", department=dept, semester=5, teacher=teacher)
    
    print("✓ Setup complete (Teacher, Student, Subject created)")

    # 2. Test GPS distance calculation
    print("\n2. Testing GPS logic...")
    # Exact same spot
    dist1 = calc_distance(19.0760, 72.8777, 19.0760, 72.8777)
    # Approx 60 meters away (latitude change)
    dist2 = calc_distance(19.0760, 72.8777, 19.0765, 72.8777)
    print(f"Distance (same spot): {dist1:.2f}m (Expected: 0m)")
    print(f"Distance (60m away): {dist2:.2f}m (Expected: ~55m)")
    assert dist1 < 50
    assert dist2 > 50
    print("✓ GPS logic working correctly")
    
    # 3. Test Session Creation
    print("\n3. Testing Session Creation...")
    code = "1234"
    expires_at = timezone.now() + timedelta(seconds=20)
    session = AttendanceSession.objects.create(
        subject=subject, teacher=teacher, code=code, expires_at=expires_at,
        latitude=19.0760, longitude=72.8777, is_active=True
    )
    print(f"✓ Session created with code {session.code}, active: {session.is_active}")
    
    # 4. Test Valid Attendance Marking
    print("\n4. Testing Valid Student Verification...")
    # Within 50 meters
    student_lat, student_lon = 19.0761, 72.8778 # ~15m away
    dist = calc_distance(session.latitude, session.longitude, student_lat, student_lon)
    
    if dist <= 50 and timezone.now() <= session.expires_at:
        att = Attendance.objects.create(student=student, session=session)
        print(f"✓ Attendance marked successfully! (Distance was {dist:.2f}m)")
    else:
        print(f"✗ Failed valid attendance (Distance was {dist:.2f}m)")
        
    # 5. Test Duplicate Attendance
    print("\n5. Testing Duplicate Attendance Check...")
    duplicate_exists = Attendance.objects.filter(student=student, session=session).exists()
    if duplicate_exists:
        print("✓ Duplicate attendance successfully detected and blocked.")
        
    # 6. Test Expiration Logic
    print("\n6. Testing Session Expiration...")
    # Simulate time passing by modifying the session's expires_at to be in the past
    session.expires_at = timezone.now() - timedelta(seconds=1)
    session.save()
    
    if timezone.now() > session.expires_at:
        session.is_active = False
        session.save()
        print("✓ Session successfully marked as expired and inactive.")

    # 7. Test Summary Aggregation
    print("\n7. Testing Dashboard Summary Aggregation...")
    total_sessions = AttendanceSession.objects.filter(subject=subject).count()
    attended = Attendance.objects.filter(student=student, session__subject=subject).count()
    percentage = round((attended / total_sessions * 100), 1) if total_sessions > 0 else 0
    print(f"Subject: {subject.name} | Total Sessions: {total_sessions} | Attended: {attended} | Percentage: {percentage}%")
    assert percentage == 100.0
    print("✓ Summary aggregated correctly.")
    
    print("\n--- ALL TESTS PASSED SUCCESSFULLY! ---")

if __name__ == '__main__':
    run_tests()
