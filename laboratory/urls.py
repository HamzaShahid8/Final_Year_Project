from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from .models import *

router = DefaultRouter()
router.register('tests', LabTestViewSet, basename="tests")
router.register('orders', LabOrderViewSet, basename='orders')
router.register('reports', LabReportViewSet, basename='reports')

urlpatterns = [
    path('', include(router.urls)),
]