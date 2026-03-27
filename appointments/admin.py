from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'patient',
        'doctor',
        'appointment_date',
        'appointment_time',
        'status',
        'created_at',
    )
    
    list_filter = (
        'status',
        'appointment_date',
        'doctor',
    )