from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'created_at')
    list_filter = ('name', 'price', 'description')
    search_fields = ('name', 'price')
    
@admin.register(LabOrder)
class LabOrderAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'medical_record', 'status', 'created_at')
    list_filter = ('patient', 'doctor', 'medical_record')
    search_fields = ('medical_record', 'patient', 'doctor')
    
@admin.register(LabReport)
class LabReportAdmin(admin.ModelAdmin):
    list_display = ('lab_order', 'result', 'report_file')
    list_filter = ('lab_order', 'result')
    search_fields = ('lab_order', 'result', 'report_file')