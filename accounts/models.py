from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
        ('patient', 'Patient'),
        ('receptionist', 'Receptionist'),
    ]
    role = models.CharField(max_length=70, choices=ROLE_CHOICES)
    phn_no = models.CharField(max_length=20, null=True, blank=True)
    image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    def __str__(self):
        return self.username