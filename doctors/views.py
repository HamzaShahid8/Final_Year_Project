from django.shortcuts import render
from .models import *
from .serializers import *
from accounts.permissions import *
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["specialization", "availability"]
    search_fields = ["user__username", "specialization"]
    ordering_fields = ["experience", "consultation_fee"]
    
    permission_classes = [IsAuthenticated]
    
    
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'doctor'):
            return Doctor.objects.filter(user=user)
        return Doctor.objects.all()

    def get_permissions(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create']:
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        user = self.request.user
        
        if user.role == 'doctor':
            serializer.save(user=user)
        else:
            serializer.save()

class DoctorScheduleViewSet(viewsets.ModelViewSet):
    queryset = DoctorSchedule.objects.all()
    serializer_class = DoctorScheduleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["doctor", "day"]
    search_fields = ["doctor__user__username", "day"]
    ordering_fields = ["start_time", "end_time"]
    
    permission_classes = [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'doctor'):
            return DoctorSchedule.objects.filter(doctor__user=user)
        return DoctorSchedule.objects.all()
    
    def get_permissions(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create']:
            if self.action in ['create']:
                if user.role == 'doctor':
                    return [IsAuthenticated(), IsDoctor()]
                return [IsAuthenticated(), IsAdminOrReceptionist()]
            
            if self.action in ['update', 'destroy', 'partial_update']:
                return [IsAuthenticated(), IsDoctor()]
            
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated()]
            return [IsAuthenticated()]
        return [IsAuthenticated()]
        
    def perform_create(self, serializer):
        user = self.request.user
        
        if user.role == 'doctor':
            serializer.save(doctor=user.doctor)
        else:
            serializer.save()