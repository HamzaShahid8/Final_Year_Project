from rest_framework import serializers
from .models import *

class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source = 'user.username', read_only=True)
    email = serializers.CharField(source = 'user.email', read_only=True)
    
    class Meta:
        model = Doctor
        fields = '__all__'
        read_only = ['user', 'created_at']
        
class DoctorScheduleSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.username', read_only=True)
    
    class Meta:
        model = DoctorSchedule
        fields = '__all__'
        read_only_fields = ['user']