from rest_framework import serializers
from .models import Stock, EMA


class EMASerializer(serializers.ModelSerializer):
    class Meta:
        model = EMA
        fields = "__all__"


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"
