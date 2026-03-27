from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('medical-records', MedicalRecordViewSet, basename='medical-records')
router.register('prescriptions', PrescriptionViewSet, basename='prescriptions')

urlpatterns = [
    path('', include(router.urls)),
]
