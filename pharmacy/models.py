from django.db import models
from patients.models import *
from medical_record.models import *

# Create your models here.

class Medicine(models.Model):
    name = models.CharField(max_length=100, null=False, default='Unknown Medicine')
    category = models.CharField(max_length=100) # tablet, syrup
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name or 'Unnamed Medicine'
    
class PharmacyOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='pharmacy_orders')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='pharmacy_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.patient.user.username}"
    
class PharmacyOrderItem(models.Model):
    order = models.ForeignKey(PharmacyOrder, on_delete=models.CASCADE, related_name='items')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=20, decimal_places=2)
    total_price = models.DecimalField(max_digits=30, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.price
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.medicine.name} x {self.quantity}"