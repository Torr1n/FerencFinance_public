from json import JSONDecodeError
from django.http import JsonResponse
from .serializers import EMASerializer, StockSerializer
from .models import Stock, EMA
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin


class StockViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    """
    A simple ViewSet for listing or retrieving Stocks.
    """

    permission_classes = (IsAuthenticated,)
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class EMAViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    """
    A simple ViewSet for listing or retrieving EMAs.
    """

    permission_classes = (IsAuthenticated,)
    queryset = EMA.objects.all()
    serializer_class = EMASerializer


class HighestProfitEMAView(generics.RetrieveAPIView):
    serializer_class = EMASerializer

    def retrieve(self, request, stock_id, *args, **kwargs):
        ema = EMA.objects.filter(stock_id=stock_id).order_by("-profit").first()

        if ema is None:
            return Response({"detail": "No EMAs found for this stock."}, status=404)

        serializer = self.get_serializer(ema)
        return Response(serializer.data)
