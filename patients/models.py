from django.db import models
from accounts.models import User
from doctors.models import *

class Patient(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient")

    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    address = models.TextField()

    medical_history = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    
    doctor = models.ForeignKey(Doctor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patients'
    )

    def __str__(self):
        return self.user.username