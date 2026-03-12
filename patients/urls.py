from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import Patient
from .views import *

router = DefaultRouter()
router.register('patients', PatientViewSet, basename='patients')

urlpatterns = [
    path('', include(router.urls)),
]