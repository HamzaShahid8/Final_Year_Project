from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('patients', PatientViewSet, basename='patients')

urlpatterns = [
    path('', include(router.urls)),
]
