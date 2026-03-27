from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'age', 'phone', 'created_at']
    search_fields = ['user__username', 'phone']
    list_filter = ['created_at']