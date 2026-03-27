from rest_framework import serializers
from .models import *

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'user', 'age', 'phone', 'address', 'medical_history', 'created_at']
        read_only_fields = ['user', 'created_at']