from datetime import datetime, date, timedelta
from json import JSONDecodeError
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
import pandas as pd
from ferencfinance.helpers import update_stock_data
from .serializers import EMASerializer, StockSerializer, PortfolioSerializer
from .models import Stock, EMA, Portfolio
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.mixins import (
    ListModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
)


class StockViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    A simple ViewSet for listing or retrieving Stocks.
    """

    permission_classes = (IsAuthenticated,)
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    def options(self, request, *args, **kwargs):
        """
        Handle preflight requests.
        """
        response = JsonResponse({"message": "Preflight request handled successfully"})
        response["Access-Control-Allow-Origin"] = "*"  # Set CORS headers
        response["Access-Control-Allow-Methods"] = (
            "GET, POST, DELETE, OPTIONS"  # Set allowed methods
        )
        response["Access-Control-Allow-Headers"] = (
            "Content-Type, Authorization"  # Set allowed headers
        )
        return response

    def create(self, request, *args, **kwargs):
        """
        Handle creating a new Stock.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class EMAViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    """
    A simple ViewSet for listing or retrieving EMAs.
    """

    permission_classes = (IsAuthenticated,)
    queryset = EMA.objects.all()
    serializer_class = EMASerializer


class HighestProfitEMAView(generics.RetrieveAPIView):
    serializer_class = EMASerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, stock_id, *args, **kwargs):
        stock = get_object_or_404(Stock, id=stock_id)

        if stock.portfolio.type == "Long":
            ema = EMA.objects.filter(stock=stock).order_by("-profit").first()
        else:
            ema = EMA.objects.filter(stock=stock).order_by("profit").first()

        if ema is None:
            return Response({"detail": "No EMAs found for this stock."}, status=404)

        serializer = self.get_serializer(ema)
        return Response(serializer.data)


class PortfolioViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    A simple ViewSet for listing or retrieving Portfolios.
    """

    permission_classes = (IsAuthenticated,)
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer


class AllEMAPeriodsView(generics.ListAPIView):
    serializer_class = EMASerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        stock_id = self.kwargs["stock_id"]
        return EMA.objects.filter(stock_id=stock_id).order_by("period")


class AllStocksHighestProfitEMAView(generics.ListAPIView):
    serializer_class = EMASerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, portfolio_id, *args, **kwargs):
        portfolio = get_object_or_404(Portfolio, id=portfolio_id)

        stocks = Stock.objects.filter(portfolio_id=portfolio_id)
        data = []

        for stock in stocks:
            stockdata = json.loads(stock.data)
            if portfolio.type == "Long":
                ema = EMA.objects.filter(stock=stock).order_by("-profit").first()
            else:
                ema = EMA.objects.filter(stock=stock).order_by("profit").first()
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

                serializer = self.get_serializer(ema)
                data.append(
                    {
                        "stock_ticker": stock.ticker,
                        "ema_period": {
                            "profit": ema.profit,
                            "xirr": ema.xirr,
                        },
                        "recent_trans": recent_trans,
                    }
                )

        return Response(data)


class PortfolioStocksView(generics.ListAPIView):
    """
    A view to retrieve all stocks associated with a specific portfolio.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = StockSerializer

    def get_queryset(self):
        portfolio_id = self.kwargs["portfolio_id"]
        return Stock.objects.filter(portfolio_id=portfolio_id)


class AllStocksExcelExportView(generics.ListAPIView):
    serializer_class = EMASerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, portfolio_id, *args, **kwargs):
        portfolio = get_object_or_404(Portfolio, id=portfolio_id)

        stocks = Stock.objects.filter(portfolio_id=portfolio_id)
        data = []

        for stock in stocks:
            if portfolio.type == "Long":
                ema = EMA.objects.filter(stock=stock).order_by("-profit").first()
            else:
                ema = EMA.objects.filter(stock=stock).order_by("profit").first()
            if ema is not None:
                serializer = self.get_serializer(ema)
                data.append(
                    {
                        "ticker": stock.ticker,
                        "profit": ema.profit,
                        "xirr": ema.xirr,
                        "period": ema.period,
                        "signals": json.loads(ema.signals),
                    }
                )

        return Response(data)


class UpdateAllStocksView(generics.ListCreateAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        # Iterate through each stock
        for stock in self.get_queryset():
            data_df = pd.DataFrame(
                json.loads(stock.data),
                columns=["Date", "Open", "High", "Low", "Close"],
            )

            weekly_data = update_stock_data(stock.ticker, data_df)

            # Check if there is new data
            if weekly_data != None:
                print(weekly_data)
                print(stock.ticker)
                # Update stock data
                stock.data = json.dumps(weekly_data)
                stock.save()

        return Response({"message": "All stocks updated successfully."})
