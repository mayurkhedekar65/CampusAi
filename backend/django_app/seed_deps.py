import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from academics.models import Department

departments = [
    'Computer Science', 'IT', 'E-Comp', 'Mechanical', 'Civil', 'Electrical', 'Electronics'
]
for dept in departments:
    Department.objects.get_or_create(name=dept)

print("Departments seeded successfully.")
