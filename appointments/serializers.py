from rest_framework import serializers
from .models import *
from patients.models import *
from doctors.models import *
from patients.models import *
from doctors.models import *

class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    class Meta:
        model = Appointment
        fields = '__all__'