from django.db import models
from patients.models import Patient
from doctors.models import Doctor
from medical_record.models import *

class LabTest(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class LabOrder(models.Model):
    STATUS_CHOICES = [('pending','Pending'),('completed','Completed')]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_orders')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='lab_orders')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='lab_orders')
    tests = models.ManyToManyField(LabTest, related_name='lab_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"LabOrder {self.id}"

class LabReport(models.Model):
    lab_order = models.OneToOneField(LabOrder, on_delete=models.CASCADE, related_name='report')
    result = models.TextField()
    report_file = models.FileField(upload_to='lab_reports/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"LabReport {self.id}"