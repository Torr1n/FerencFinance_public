from django.contrib import admin
from . import models


@admin.register(models.Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("id", "ticker")


@admin.register(models.EMA)
class EMAAdmin(admin.ModelAdmin):
    list_display = ("id", "stock")
