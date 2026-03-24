from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role,
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['TEACHER', 'HOD']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        queryset = User.objects.filter(role='STUDENT')
        
        # HOD automatically scoped to their own department
        if request.user.role == 'HOD':
            if not request.user.department:
                return Response([], status=status.HTTP_200_OK)
            queryset = queryset.filter(department=request.user.department)
        else:
            # Teacher: optional department filter
            department_id = request.query_params.get('department')
            if department_id:
                queryset = queryset.filter(department_id=department_id)

        # Both can filter by semester
        semester = request.query_params.get('semester')
        if semester:
            queryset = queryset.filter(semester=semester)
            
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

class UpdateStudentAcademicsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role not in ['TEACHER', 'HOD']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            queryset = User.objects.filter(role='STUDENT')
            # HOD can only update students in their department
            if request.user.role == 'HOD' and request.user.department:
                queryset = queryset.filter(department=request.user.department)
            student = queryset.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'Student not found in your department'}, status=status.HTTP_404_NOT_FOUND)
            
        cgpa = request.data.get('cgpa')
        credits = request.data.get('credits')
        
        if cgpa is not None:
            student.cgpa = float(cgpa)
        if credits is not None:
            student.credits = int(credits)
            
        student.save()
        return Response({'success': True, 'cgpa': student.cgpa, 'credits': student.credits})
