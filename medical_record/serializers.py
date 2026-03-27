from rest_framework import serializers
from .models import MedicalRecord, Prescription

# Prescription serializer
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'medicine_name', 'dosage', 'frequency', 'duration', 'instructions', 'created_at']
        read_only_fields = ['id', 'created_at']

# Medical Record serializer with nested prescriptions
class MedicalRecordSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, required=False)

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
        read_only_fields = ['doctor', 'visit_date']
        
    def create(self, validated_data):
        
        prescriptions_date = validated_data.pop('prescriptions', [])
        
        medical_record = MedicalRecord.objects.create(**validated_data)
        
        for prescription in prescriptions_date:
            Prescription.objects.create(
                medical_record=medical_record,
                medicine_name=prescription.get('medicine_name'),
                dosage=prescription.get('dosage'),
                frequency=prescription.get('frequency'),
                duration=prescription.get('duration'),
                instructions=prescription.get('instructions')
            )
        return medical_record