from django.shortcuts import render
from rest_framework import viewsets, status
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

# Create your views here.

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['price', 'stock_quantity', 'expiry_date', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        
        if self.action in ['create', 'update', 'destroy', 'partial_update']:
            if user.role == 'pharmacist':
                return [IsAuthenticated(), IsPharmacist()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if user.role == 'pharmacist':
            return Medicine.objects.all()
        if user.role in ['admin', 'receptionist']:
            return Medicine.objects.all()
        return Medicine.objects.all()
    
    # Create with bulk support and validations
    def create(self, request, *args, **kwargs):
        data = request.data
        
        # Bulk add if list
        if isinstance(data, list):
            created_medicines = []
            for item in data:
                serializer = self.get_serializer(data=item)
                serializer.is_valid(raise_exception=True)
                
                # Validations
                expiry_date = serializer.validated_data.get('expiry_date')
                if expiry_date and expiry_date < timezone.now().date():
                    raise ValidationError({'expiry_date': "Cannot add expired medicine"})
                
                stock_quantity = serializer.validated_data.get('stock_quantity')
                if stock_quantity < 0:
                    raise ValidationError({'stock_quantity': 'Stock cannot be negative'})
                
                medicine = serializer.save()
                created_medicines.append(medicine)
            
            return Response(self.get_serializer(created_medicines, many=True).data, status=status.HTTP_201_CREATED)
        
        # Single medicine add
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        expiry_date = serializer.validated_data.get('expiry_date')
        if expiry_date and expiry_date < timezone.now().date():
            raise ValidationError({'expiry_date': "Cannot add expired medicine"})
        
        stock_quantity = serializer.validated_data.get('stock_quantity')
        if stock_quantity < 0:
            raise ValidationError({'stock_quantity': 'Stock cannot be negative'})
        
        medicine = serializer.save()
        return Response(self.get_serializer(medicine).data, status=status.HTTP_201_CREATED)
    
    
class PharmacyOrderViewSet(viewsets.ModelViewSet):
    queryset = PharmacyOrder.objects.all()
    serializer_class = PharmacyOrderSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['patient', 'medical_record']
    ordering_fields = ['status', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            return [IsAuthenticated(), IsPharmacist()]
        
        if self.action in ['create']:
            if user.role == 'pharmacist':
                return [IsAuthenticated(), IsPharmacist()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['update', 'partial_update', 'destroy']:
            if user.role == 'pharmacist':
                return [IsAuthenticated(), IsPharmacist()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'pharmacist':
            return PharmacyOrder.objects.all()
        if user.role in ['admin', 'receptionist']:
            return PharmacyOrder.objects.all()
        if user.role == 'patient' and hasattr(user, 'patient'):
            return PharmacyOrder.objects.filter(patient=user.patient)
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return PharmacyOrder.objects.filter(medical_record__doctor=user.doctor)
        
        return PharmacyOrder.objects.none()
    

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = serializer.save()

        return Response(
            self.get_serializer(order).data
        )
    
class PharmacyOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PharmacyOrderItem.objects.all()
    serializer_class = PharmacyOrderItemSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['order', 'medicine', 'quantity']
    ordering_fields = ['quantity', 'price']
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        if self.action in ['list', 'retrieve']:
            if user.role == 'patient':
                return [IsAuthenticated(), IsPatient()]
            return [IsAuthenticated(), IsPharmacist()]
        
        if self.action in ['create']:
            if user.role == 'pharmacist':
                return [IsAuthenticated(), IsPharmacist()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['update', 'partial_update']:
            if user.role == 'pharmacist':
                return [IsAuthenticated(), IsPharmacist()]
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        
        if self.action in ['destroy']:
            return [IsAuthenticated(), IsPharmacist()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == 'pharmacist':
            return PharmacyOrderItem.objects.all()
        if user.role in ['admin', 'receptionist']:
            return PharmacyOrderItem.objects.all()
        if user.role == 'patient' and hasattr(user, 'patient'):
            return PharmacyOrderItem.objects.filter(order__patient=user.patient)
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            return PharmacyOrderItem.objects.filter(order__medical_record__doctor=user.doctor)
        return PharmacyOrderItem.objects.none()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user

        # Permission check
        if user.role not in ['admin', 'receptionist', 'pharmacist']:
            raise ValidationError("Only Admin, Receptionist, or Pharmacist can create order items.")

        medicine = serializer.validated_data['medicine']
        quantity = serializer.validated_data['quantity']

        # Stock validation
        if medicine.stock_quantity < quantity:
            raise ValidationError(f"{medicine.name} is out of stock (Available: {medicine.stock_quantity})")

        # Reduce stock
        medicine.stock_quantity -= quantity
        medicine.save()

        # Set price and total_price automatically
        serializer.validated_data['price'] = medicine.price
        serializer.validated_data['total_price'] = medicine.price * quantity

        # Save order item
        order_item = serializer.save()

        return Response(self.get_serializer(order_item).data, status=status.HTTP_201_CREATED)