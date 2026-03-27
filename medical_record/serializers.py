from rest_framework import serializers
from .models import MedicalRecord, Prescription

# Prescription serializer
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'medical_record', 'medicine_name', 'dosage', 'frequency', 'duration', 'instructions', 'created_at']
        read_only_fields = ['id', 'created_at']

# Medical Record serializer with nested prescriptions
class MedicalRecordSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            'id',
            'appointment',
            'patient',
            'doctor',
            'visit_date',
            'symptoms',
            'diagnosis',
            'notes',
            'status',
            'follow_up_date',
            'prescriptions',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'doctor', 'visit_date', 'created_at', 'updated_at']