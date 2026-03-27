from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import viewsets, status
from accounts.permissions import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

# Create your views here.

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    filterset_fields = ['patient', 'doctor', 'appointment', 'pharmacy_order', 'lab_order']
    search_fields = ['patient', 'doctor', 'doctor_fee', 'lab_cost', 'medicine_cost']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'patient' and hasattr(user, 'patient'):
            return Bill.objects.filter(patient=user.patient)
        
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return Bill.objects.filter(doctor=user.doctor)
        
        return Bill.objects.all()
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create', 'update', 'destroy', 'partial_update']:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(

            data=request.data
        )


        serializer.is_valid(

            raise_exception=True
        )


        appointment = serializer.validated_data.get(

            'appointment'
        )


        pharmacy_order = serializer.validated_data.get(

            'pharmacy_order'
        )


        lab_order = serializer.validated_data.get(

            'lab_order'
        )


        patient = appointment.patient

        doctor = appointment.doctor


        doctor_fee = doctor.consultation_fee


        medicine_cost = 0

        if pharmacy_order:

            medicine_cost = pharmacy_order.total_price


        lab_cost = 0

        if lab_order:

            lab_cost = lab_order.test.price


        bill = Bill.objects.create(

            patient = patient,

            doctor = doctor,

            appointment = appointment,

            pharmacy_order = pharmacy_order,

            lab_order = lab_order,

            doctor_fee = doctor_fee,

            medicine_cost = medicine_cost,

            lab_cost = lab_cost
        )


        return Response(

            BillSerializer(bill).data,

            status=201
        )