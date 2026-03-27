from django.db import models
from patients.models import *
from doctors.models import *
from appointments.models import *
from pharmacy.models import *
from laboratory.models import *

# Create your models here.

class Bill(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='bills')
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='bill')
    pharmacy_order = models.ForeignKey(PharmacyOrder, on_delete=models.SET_NULL, null=True, blank=True)
    lab_order = models.ForeignKey(LabOrder, on_delete=models.SET_NULL, blank=True, null=True)
    doctor_fee = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    medicine_cost = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    lab_cost = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=200, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def calculate_total(self):
        self.total_amount = (
            self.doctor_fee + self.medicine_cost + self.lab_cost
        )
        return self.total_amount
    
    def save(self, *args, **kwargs):
        self.calculate_total()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Bill {self.id} - {self.patient}"