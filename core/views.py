from django.shortcuts import render
from rest_framework import generics,viewsets, permissions
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer

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
    
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Task.objects.filter(is_deleted=False)
        return Task.objects.filter(assigned_to=user, is_deleted=False)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()