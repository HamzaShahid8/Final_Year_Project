from django.shortcuts import render
from .models import *
from .serializers import *
from accounts.permissions import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied, ValidationError

# Create your views here.

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['doctor', 'patient', 'appointment_date']
    search_fields = ['patient__user__username', 'doctor__user__username', 'reason']
    ordering_fields = ['appointment_date', 'created_at']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if self.action in ['create']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['update', 'partial_update', 'destroy']:
            if user.role in ['admin', 'receptionist']:
                return [IsAuthenticated(), IsAdminOrReceptionist()]
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated()] # patient cannot modify appointment
        
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
            return Appointment.objects.filter(patient__user=user)
        if user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.all()
    
    def perform_create(self, serializer):
        user = self.request.user

        if user.role == 'patient':
            # Patient automatically assigns themselves
            try:
                serializer.save(patient=user.patient)
            except Patient.DoesNotExist:
                raise ValidationError("Your patient profile does not exist yet.")
        else:
            # Admin/receptionist: patient is provided in the JSON body
            patient = serializer.validated_data.get('patient')
            if not patient:
                raise ValidationError("You must provide a valid patient ID.")
            
            serializer.save()