from django.shortcuts import render
from patients.models import *
from doctors.models import *
from billing.models import *
from pharmacy.models import *
from medical_record.models import *
from laboratory.models import *
from accounts.models import *
from appointments.models import *
from rest_framework import viewsets
from accounts.permissions import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        
        user = self.request.user
        
        if not user.is_authenticated:
            return [IsAuthenticated()]
        
        # sb authenticated users dekh skty hain
        return [IsAuthenticated()]
    
    def list(self, request):
        
        user = request.user
        
        # admin / receptionist -> full data
        if user.role in ['admin', 'receptionist']:
            
            total_revenue = sum(
                bill.total_amount for bill in Bill.objects.all()
            )
            
            data = {
                'total_patients': Patient.objects.count(),
                'total_doctors': Doctor.objects.count(),
                'total_appointments': Appointment.objects.count(),
                "total_lab_orders": LabOrder.objects.count(),
                'total_pharmacy_orders': PharmacyOrder.objects.count(),
                'total_revenue': total_revenue
            }
            return Response(data)
        
        # doctor own patients stats
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            
            doctor = user.doctor
            
            appointments = Appointment.objects.filter(doctor=doctor)
            
            data = {
                'my_appointments': appointments.count(),
                'my_patients': Patient.objects.filter(appointments__doctor=doctor).distinct().count(),
                'my_revenue': sum(bill.doctor_fee for bill in Bill.objects.filter(doctor=doctor))
                
            }
            return Response(data)
        
        # patient own stats
        if user.role == 'patient' and hasattr(user, 'patient'):
            
            patient = user.patient
            
            data = {
                'my_appointments': Appointment.objects.filter(patient=patient).count(),
                'my_lab_orders': LabOrder.objects.filter(patient=patient).count(),
                'my_pharmacy_orders': PharmacyOrder.objects.filter(patient=patient).count(),
                'my_total_bill': sum(bill.total_amount for bill in Bill.objects.filter(patient=patient))
            }
            return Response(data)
        return Response({})
    
    
# Revenue Analytics

class RenevueAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        
        user = self.request.user
        
        if user.role == 'admin':
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def list(self, request):
        
        bills = Bill.objects.all()
        
        data = {
            'total_revenue': sum(bill.total_amount for bill in bills),
            'doctor_fee _total': sum(bill.doctor_fee for bill in bills),
            'medicine_total': sum(bill.medicine_cost for bill in bills),
            'lab_total': sum(bill.lab_cost for bill in bills),
            "paid_bills": Bill.objects.filter(status='paid').count(),
            'pending_bills': Bill.objects.filter(status='pending').count(),
        }
        return Response(data)
    
# appointment analytics

class AppointmentAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        
        user = request.user
        
        # doctor own analytics
        if user.role == 'doctor' and hasattr(user, 'doctor'):
            doctor = user.doctor
            
            appointments = Appointment.objects.filter(doctor=doctor)
            
            data = {
                'pending_appointments': Appointment.objects.filter(doctor=doctor, status='pending').count(),
                'completed_appointments': Appointment.objects.filter(doctor=doctor, status='completed').count(),
            }
            return Response(data)
        
        # admin full access
        pending = Appointment.objects.filter(status='pending').count()
        completed = Appointment.objects.filter(status='completed').count()
        
        return Response ({
            'total': Appointment.object.count(),
            'pending': pending,
            'completed': completed
        })
        
# lab-orders analytics
class LabOrderAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        
        lab_orders = LabOrder.objects.count()
        
        pending = LabOrder.objects.filter(status='pending').count(),
        completed = LabOrder.objects.filter(status='completed')
        
        return Response({
            'total': lab_orders,
            'pending': pending,
            'completed': completed
        })
        
# pharmacy analytics
class PharmacyAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        
        items = PharmacyOrderItem.objects.all()
        
        total_quantity = sum(item.quantity for item in items)
        total_revenue = sum(item.total_price for item in items)
        
        return Response({
            'total_orders': PharmacyOrderItem.objects.count(),
            'medicine_sold': total_quantity,
            'pharmacy_revenue': total_revenue
        })