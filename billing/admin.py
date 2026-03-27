from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'appointment', 'doctor_fee', 'lab_cost', 'medicine_cost')
    search_fields = ('id', 'patient', 'doctor')
    ordering_fields = ('created_at',)