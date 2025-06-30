from django.urls import path, include
from .views import RegisterView, ProjectViewSet, TaskViewSet, ActivityLogViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('tasks', TaskViewSet)
router.register('activity-logs', ActivityLogViewSet, basename='activitylog')


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
