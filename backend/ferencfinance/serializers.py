from datetime import datetime
import json
from rest_framework import serializers
from .models import Stock, EMA, Portfolio


class EMASerializer(serializers.ModelSerializer):
    class Meta:
        model = EMA
        fields = "__all__"


class PortfolioSerializer(serializers.ModelSerializer):
    recent_trans_sum = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = "__all__"

    def get_recent_trans_sum(self, obj):
        stocks = obj.stocks.all()
        sum = 0
        for stock in stocks:
            stockdata = json.loads(stock.data)

            ema = EMA.objects.filter(stock=stock).order_by("-profit").first()
            if ema is not None:
                signals = json.loads(ema.signals)

                most_recent_signal = signals[-1]
                most_recent_data = stockdata[-1]

                if most_recent_signal is not None:
                    most_recent_date = datetime.utcfromtimestamp(
                        most_recent_data[0] / 1000.0
                    )

                # Check the conditions for recent_trans
                recent_trans = "None"
                if signals:
                    most_recent_signal = signals[-1]
                    signal_date = datetime.utcfromtimestamp(
                        most_recent_signal["date"] / 1000.0
                    )

                    if (
                        most_recent_signal["signal"] == "Buy"
                        and (most_recent_date - signal_date).days <= 7
                    ):
                        recent_trans = "Buy"
                    elif (
                        most_recent_signal["signal"] == "Sell"
                        and (most_recent_date - signal_date).days <= 7
                    ):
                        recent_trans = "Sell"

                if recent_trans != "None":
                    sum += 1

        return sum


class StockSerializer(serializers.ModelSerializer):
    portfolio_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Stock
        fields = "__all__"
