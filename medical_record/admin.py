from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'patient', 'doctor', 'diagnosis', 'symptoms', 'visit_date')
    list_filter = ('appointment', 'patient', 'doctor', 'diagnosis')
    search_fields = ('appointment', 'diagnosis')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medical_record', 'medicine_name', 'dosage', 'frequency')
    list_filter = ('medical_record', 'medicine_name', 'dosage', 'frequency')
    search_fields = ('medical_record', 'medicine_name', 'dosage', 'instructions', 'duration')