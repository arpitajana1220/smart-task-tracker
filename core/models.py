from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('contributor', 'Contributor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='contributor')

    def __str__(self):
        return f"{self.username} ({self.role})"

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'Todo'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)  # For soft delete

    def __str__(self):
        return f"{self.title} ({self.project.title})"