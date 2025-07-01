from django.shortcuts import render
from rest_framework import generics,viewsets, permissions
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import Project, Task, ActivityLog
from rest_framework.permissions import IsAuthenticated
from .serializers import ProjectSerializer, TaskSerializer, ActivityLogSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .token_serializers import MyTokenObtainPairSerializer
# Create your views here.

User = get_user_model()

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        role = self.request.query_params.get('role')
        queryset = super().get_queryset()
        if role:
            queryset = queryset.filter(role=role)
        return queryset
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(is_deleted=False)

        if user.role != 'admin':
            queryset = queryset.filter(assigned_to=user)

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        due_param = self.request.query_params.get('due_date')
        if due_param:
            queryset = queryset.filter(due_date=due_param)

        return queryset

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdmin()]
        # Allow update for contributors (logic handled in method)
        return [permissions.IsAuthenticated()]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_deleted = True
        task.save()
        return Response({'detail': 'Task soft-deleted.'}, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Save previous values
        prev_assignee = instance.assigned_to
        prev_status = instance.status
        prev_due_date = instance.due_date

        # Admin can update everything
        if user.role == 'admin':
            response = super().update(request, *args, **kwargs)

        # Contributor: can only update status
        elif user.role == 'contributor':
            new_status = request.data.get('status')
            if new_status and new_status != instance.status:
                instance.status = new_status
                instance.save()
                serializer = self.get_serializer(instance)
                response = Response(serializer.data)
            else:
                return Response(
                    {'error': 'Contributors can only update status.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        # Activity logging (for both roles)
        ActivityLog.objects.update_or_create(
            task=instance,
            defaults={
                'previous_assignee': prev_assignee,
                'previous_status': prev_status,
                'previous_due_date': prev_due_date
            }
        )

        return response

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]