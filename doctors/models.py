from django.db import models
from accounts.models import User

# Create your models here.

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor')
    specialization = models.CharField(max_length=100)
    experience = models.CharField(max_length=100, help_text='Years of experience')
    qualification = models.CharField(max_length=100)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    room_no = models.CharField(max_length=5)
    bio = models.TextField(blank=True)
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Dr. {self.user.username} - {self.specialization}"
    
# doctor schedule for appointments
class DoctorSchedule(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=20) # monday, tuesday...
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_patients = models.PositiveIntegerField(default=5)
    is_booked = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['doctor', 'day', 'start_time', 'end_time']
        
    def __str__(self):
        return f"{self.doctor.user.username} - {self.day} - {self.start_time} - {self.end_time}"