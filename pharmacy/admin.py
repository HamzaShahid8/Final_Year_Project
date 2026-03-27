from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'stock_quantity', 'expiry_date')
    list_filter = ('name', 'price', 'stock_quantity', 'expiry_date')
    
@admin.register(PharmacyOrder)
class PharmacyOrderAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medical_record', 'status')
    list_filter = ('patient', 'medical_record')
    
@admin.register(PharmacyOrderItem)
class PharmacyOrderItemAdmmin(admin.ModelAdmin):
    list_display = ('order', 'medicine', 'quantity', 'price')
    list_filter = ('order', 'medicine', 'quantity', 'price')