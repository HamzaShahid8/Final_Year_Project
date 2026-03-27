from django.shortcuts import render
from .models import *
from .serializers import *
from accounts.permissions import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['age']
    search_fields = ['user__username', 'phone']
    ordering_fields = ['age', 'created_at']
    
    def get_permissions(self):
        user = self.request.user
        
        if self.action in ['create']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'patient':
            return Patient.objects.filter(user=user)
        
        return Patient.objects.all()
        
    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'patient':
            serializer.save(user=user)
        else:
            serializer.save()