from django.shortcuts import render
from .models import Patient
from .serializers import PatientSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import *
from rest_framework import viewsets

# Create your views here.

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user__username', 'age', 'phone']
    search_fields = ['user__username', 'phone']
    ordering_fields = ['age', 'created_at']
    
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            if self.request.user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            
            if self.request.user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'patient':
            return Patient.objects.filter(user=user)
        
        return Patient.objects.all()