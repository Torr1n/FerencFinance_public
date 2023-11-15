from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from ferencfinance.helpers import *
import pandas as pd

from ferencfinance.models import EMA, Stock


@receiver(post_save, sender=User, weak=False)
def report_uploaded(sender, instance, created, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=Stock)
def update_stock_data_on_create(sender, instance, created, **kwargs):
    if created:
        for period in range(3, 101):
            data = pd.read_json(instance.data)
            ema = calculate_ema(data, period)
            data["EMA"] = ema
            data["Date"] = ema.index.tolist()
            result = generate_signals_and_xirr(data)
            signals, xirr, cash_flows = result
            if not xirr:
                xirr = 0

            profit = calculate_profits(signals)
            EMA.objects.create(
                stock=instance,
                period=period,
                profit=profit,
                xirr=xirr,
                signals=signals.to_json(),
            )


@receiver(pre_save, sender=Stock)
def validate_ticker(sender, instance, **kwargs):
    try:
        if instance.startDate:
            instance.data = get_stock_data(
                instance.ticker, instance.startDate
            ).to_json()
        else:
            instance.data = get_stock_data(instance.ticker).to_json()

    except Exception as e:
        raise ValidationError(f"Invalid ticker: {instance.ticker}, Error: {str(e)}")
