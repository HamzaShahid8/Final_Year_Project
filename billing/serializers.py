from rest_framework import serializers
from .models import *

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = "__all__"
        read_only_fields = ['doctor_fee', 'medicine_cost', 'lab_cost', 'total_amount', 'created_at']