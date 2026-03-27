from django.shortcuts import render
from .models import *
from .serializers import *
from accounts.permissions import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    filterset_fields = ['name', 'price']
    search_fields = ['name', 'description', 'price']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    
    # sb user test dekh skty hn
    def get_queryset(self):
        return LabTest.objects.all()
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create', 'update', 'parital_update', 'destroy']:
            if user.role == 'lab_technician':
                return [IsAuthenticated(), IsLabTechnician()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        data = request.data
        
        if isinstance(data, list):
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            
            serializer.save()
            
            return Response(serializer.data)
        
        # single k liy
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        
        return Response(serializer.data)
    
class LabOrderViewSet(viewsets.ModelViewSet):
    queryset = LabOrder.objects.all()
    serializer_class = LabOrderSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    filterset_fields = ['patient', 'doctor', 'medical_record']
    search_fields = ['patient', 'doctor', 'medical_record']
    ordering_fields = ['medical_record', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        
        user = self.request.user
        
        # doctors sirf apny patients ka order dekhy
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return LabOrder.objects.filter(doctor=user.doctor)
        
        #patients apna order dekhy
        if user.role == 'patient' and hasattr(user, 'patient'):
            return LabOrder.objects.filter(patient=user.patient)
        
        # admin/receptionist sb dekh skty hn
        return LabOrder.objects.all()
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create', 'update', 'destroy', 'partial_update']:
            if user.role == 'doctor':
                return [IsAuthenticated(), IsDoctor()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    # create lab order
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        medical_record = serializer.validated_data.get('medical_record')
        tests = serializer.validated_data.get('tests')

        # doctor sirf apne patient ka order create kare
        if user.role == 'doctor':
            if medical_record.doctor != user.doctor:
                raise PermissionDenied(
                "Doctor can create lab test only for own patient"
            )

            order = LabOrder.objects.create(
                patient = medical_record.patient,
                doctor = user.doctor,
                medical_record = medical_record,
                status = serializer.validated_data.get('status', 'pending')
            )
            order.tests.set(tests)

        # admin / receptionist create kar sakte hain
        elif user.role in ['admin', 'receptionist']:
            order = serializer.save()
        else:
            raise PermissionDenied(
            "Patient cannot create lab order"
        )

        return Response(
        LabOrderSerializer(order).data,
        status=201
        )
        
class LabReportViewSet(viewsets.ModelViewSet):
    queryset = LabReport.objects.all()
    serializer_class = LabReportSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    filterset_fields = ['lab_order', 'result']
    search_fields = ['lab_order', 'result', 'report_file']
    ordering_fields = ['lab_orders', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return LabReport.objects.filter(lab_order__doctor=user.doctor)
        
        if user.role == 'patient' and hasattr(user, 'patient'):
            return LabReport.objects.filter(lab_order__patient=user.patient)
        
        return LabReport.objects.all()
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            if user.role == 'lab_technician':
                return [IsAuthenticated(), IsLabTechnician()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    # create report
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(

            data=request.data
        )


        serializer.is_valid(

            raise_exception=True
        )


        user = request.user


        lab_order = serializer.validated_data.get(

            'lab_order'
        )



        # lab technician valid order par report banaye
        if user.role == 'lab_technician':


            if not LabOrder.objects.filter(

                id=lab_order.id
            ).exists():


                raise PermissionDenied(

                    "Invalid lab order"
                )



            report = LabReport.objects.create(

                lab_order = lab_order,

                result = serializer.validated_data.get(

                    'result'
                ),

                report_file = serializer.validated_data.get(

                    'report_file'
                )
            )


        else:


            report = serializer.save()



        return Response(

            LabReportSerializer(
                report
            ).data
        )