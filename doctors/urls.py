from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('doctors', DoctorViewSet, basename='doctors')
router.register('doctor-schedules', DoctorScheduleViewSet, basename='doctor-schedules')

urlpatterns = [
    path('', include(router.urls)),
]