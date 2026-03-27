from rest_framework import serializers
from .models import *

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'name', 'category', 'price', 'stock_quantity', 'expiry_date', 'created_at']
        
class PharmacyOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyOrderItem
        fields = ['id', 'order', 'medicine', 'quantity', 'price', 'total_price']
        
# Input-only serializer for nested items
class PharmacyOrderItemNestedSerializer(serializers.Serializer):
    medicine = serializers.PrimaryKeyRelatedField(queryset=Medicine.objects.all())
    quantity = serializers.IntegerField(min_value=1)
# Output
class PharmacyOrderItemReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyOrderItem
        fields = ['id', 'medicine', 'quantity', 'price', 'total_price']
        
class PharmacyOrderSerializer(serializers.ModelSerializer):
    items = PharmacyOrderItemNestedSerializer(many=True, write_only=True)  # for input
    order_items = PharmacyOrderItemReadSerializer(source='items', many=True, read_only=True)  # for output

    class Meta:
        model = PharmacyOrder
        fields = ['id', 'patient', 'medical_record', 'status', 'created_at', 'items', 'order_items']

    def create(self, validated_data):

        items_data = validated_data.pop('items')

        order = PharmacyOrder.objects.create(**validated_data)

        for item in items_data:

            medicine = item['medicine']
            quantity = item['quantity']

            medicine.stock_quantity -= quantity
            medicine.save()

            PharmacyOrderItem.objects.create(
                order=order,
                medicine=medicine,
                quantity=quantity,
                price=medicine.price,
                total_price=medicine.price * quantity
            )

        return order