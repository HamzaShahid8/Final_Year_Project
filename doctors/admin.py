from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "specialization", "experience", "availability")
    list_filter = ("specialization", "availability")
    search_fields = ("user__username", "specialization")

@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "doctor", "day", "start_time", "end_time", "max_patients")
    list_filter = ("day",)
    search_fields = ("doctor__user__username",)