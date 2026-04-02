from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', DashboardViewSet.as_view({'get':'list'})),
    path('revenue/', RenevueAnalyticsViewSet.as_view({'get':'list'})),
    path('appointments/', AppointmentAnalyticsViewSet.as_view({'get':'list'})),
    path('lab/', LabOrderAnalyticsViewSet.as_view({'get':'list'})),
    path('pharmacy/', PharmacyAnalyticsViewSet.as_view({'get':'list'})),
]
