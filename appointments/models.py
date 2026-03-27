from django.db import models
from patients.models import *
from doctors.models import *

# Create your models here.

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments', default='doctors')
    doctor_schedules = models.ForeignKey(DoctorSchedule, on_delete=models.CASCADE, related_name='schedules')
    appointment_date = models.DateField(null=True, blank=True)
    appointment_time = models.TimeField(null=True, blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('doctor', 'appointment_time', 'appointment_date')
        
    def save(self, *args, **kwargs):
        # doctor_schedule object check karen
        schedule = self.doctor_schedules  # ensure object hai
        if schedule and not schedule.is_booked:
            schedule.is_booked = True
            schedule.save()  # yeh proper object hai, boolean nahi
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.patient.user.username} - {self.doctor.user.username} - {self.appointment_date} - {self.appointment_time}"