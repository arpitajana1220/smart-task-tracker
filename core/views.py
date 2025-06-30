from django.shortcuts import render
from rest_framework import generics,viewsets, permissions
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

User = get_user_model()

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
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_deleted = True
        task.save()
        return Response({'detail': 'Task soft-deleted.'}, status=status.HTTP_204_NO_CONTENT)