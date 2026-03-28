from django.shortcuts import render
from accounts.permissions import *
from .models import *
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response

# Create your views here.

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['doctor', 'patient', 'appointment', 'status']
    search_fields = ['diagnosis', 'notes', 'symptoms']
    ordering_fields = ['visit_date', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['create', 'update', 'partial_update']:
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['destroy']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'patient' and hasattr(user, 'patient'):
            return MedicalRecord.objects.filter(patient=user.patient)
        
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return MedicalRecord.objects.filter(doctor=user.doctor)
        
        if user.role in ['admin', 'receptionist']:
            return MedicalRecord.objects.all()
        
        return MedicalRecord.objects.none()
    
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        # doctor apne patients k liye record bana sakta hai
        if user.role == 'doctor':

            instance = serializer.save(
                doctor=user.doctor
            )

        # admin or receptionist kisi k liye bhi bana sakta hai
        elif user.role in ['admin', 'receptionist']:

            instance = serializer.save()

        else:
            raise PermissionDenied("Patient cannot create medical records")

        # important: nested prescriptions show hon
        return Response(
            self.get_serializer(instance).data,
            status=status.HTTP_201_CREATED
        )
        
    
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = ['medicine_name']
    search_fields = ['medical_record', 'medicine_name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create']:
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['destroy']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'patient' and hasattr(user, 'patient'):
            return Prescription.objects.filter(patient=user.patient)
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return Prescription.objects.filter(doctor=user.doctor)
        if user.role in ['admin', 'receptionist']:
            return Prescription.objects.all()
        
        return Prescription.objects.none()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user

        medical_record = serializer.validated_data.get('medical_record')

        # Doctor can create only for their own patients
        if user.role == 'doctor':
            if medical_record.doctor != user.doctor:
                raise PermissionDenied("Doctor can only create prescriptions for their own patients")
            instance = serializer.save()

        # Admin/Receptionist can create for anyone
        elif user.role in ['admin', 'receptionist']:
            instance = serializer.save()

        # Patients cannot create
        else:
            raise PermissionDenied("Patient cannot create prescriptions")

        return Response(PrescriptionSerializer(instance).data, status=status.HTTP_201_CREATED)