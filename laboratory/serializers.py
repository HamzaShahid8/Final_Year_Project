from rest_framework import serializers
from .models import LabTest, LabOrder, LabReport

class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = '__all__'

class LabReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReport
        fields = '__all__'
        read_only_fields = ['created_at']

class LabOrderSerializer(serializers.ModelSerializer):
    tests = serializers.PrimaryKeyRelatedField(many=True, queryset=LabTest.objects.all())

    class Meta:
        model = LabOrder
        fields = ['id','patient','doctor','medical_record','status','created_at', 'tests']
        read_only_fields = ['created_at']
        
    def create(self, validated_data):
        # Remove tests data from validated_data before creating instance
        tests_data = validated_data.pop('tests', [])
        # Create the LabOrder object without assigning tests
        order = LabOrder.objects.create(**validated_data)
        # Assign the ManyToMany relation using .set()
        order.tests.set(tests_data)
        return order