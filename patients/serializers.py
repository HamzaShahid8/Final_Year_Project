from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    # Related User model ka username show karne ke liye
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Patient
        fields = [
            'id',
            'user',
            'username',      # linked user ka username
            'age',
            'phone',
            'address',
            'medical_history',
            'created_at'
        ]