from django.urls import path, include
from .models import *
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('bills', BillViewSet, basename='bills')

urlpatterns = [
    path('', include(router.urls)),
]
