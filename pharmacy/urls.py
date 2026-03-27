from django.urls import path, include
from .views import *
from .models import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('medicines', MedicineViewSet, basename='medicines')
router.register('pharmacy-order', PharmacyOrderViewSet, basename='pharmacy-order')
router.register('order-item', PharmacyOrderItemViewSet, basename='order-item')

urlpatterns = [
    path('', include(router.urls)),
]