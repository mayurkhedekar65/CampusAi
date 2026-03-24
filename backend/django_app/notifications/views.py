from django.db.models import Q
from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.department:
            return Response([])

        if user.role in ['HOD', 'TEACHER']:
            # Staff sees all dept notifications
            notifs = Notification.objects.filter(department=user.department)
        elif user.role == 'STUDENT':
            # Students see notifications for their dept + their semester or all
            notifs = Notification.objects.filter(department=user.department).filter(
                Q(target_semester__isnull=True) | Q(target_semester=user.semester)
            )
        else:
            notifs = Notification.objects.none()

        serializer = NotificationSerializer(notifs, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        if user.role not in ['HOD', 'TEACHER']:
            return Response({'error': 'Only HOD or Teachers can create notifications'}, status=status.HTTP_403_FORBIDDEN)

        if not user.department:
            return Response({'error': 'You must be assigned to a department'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=user, department=user.department)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        if user.role not in ['HOD', 'TEACHER']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        try:
            notif = Notification.objects.get(pk=pk, department=user.department)
            # HOD can delete any; Teacher can only delete their own
            if user.role == 'TEACHER' and notif.created_by != user:
                return Response({'error': 'Cannot delete others notifications'}, status=status.HTTP_403_FORBIDDEN)
            notif.delete()
            return Response({'success': True})
        except Notification.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
