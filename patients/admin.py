from django.contrib import admin
from .models import Patient

# Register your models here.
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user__username', 'age', 'phone', 'medical_history')
    search_fields = ('user__username', 'phone', 'age')