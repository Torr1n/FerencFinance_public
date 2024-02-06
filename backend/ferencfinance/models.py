from django.db import models
from django.dispatch import receiver
from utils.model_abstracts import Model
from django.contrib.auth.models import User
from django.db.models.signals import post_save


class Portfolio(Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=5)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Portfolio"
        verbose_name_plural = "Portfolios"
        ordering = ["id"]

    def __str__(self):
        return self.name


class Stock(Model):
    ticker = models.CharField(max_length=10)
    data = models.JSONField(blank=True, null=True)
    startDate = models.DateField(null=True, blank=True)
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="stocks",
    )

    class Meta:
        verbose_name = "Stock"
        verbose_name_plural = "Stocks"
        ordering = ["id"]

    def __str__(self):
        return self.ticker


class EMA(Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="periods")
    signals = models.JSONField()
    ema = models.JSONField()
    xirr = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    profit = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.PositiveIntegerField()
    cashflows = models.JSONField(null=True)

    class Meta:
        verbose_name = "EMA Period"
        verbose_name_plural = "EMA Periods"
        ordering = ["period"]

    def __str__(self):
        return self.stock.ticker + " period: " + str(self.period)
