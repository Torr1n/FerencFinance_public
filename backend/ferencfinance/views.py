from json import JSONDecodeError
from django.http import JsonResponse
from .serializers import EMASerializer, StockSerializer
from .models import Stock, EMA
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
        response[
            "Access-Control-Allow-Methods"
        ] = "GET, POST, DELETE, OPTIONS"  # Set allowed methods
        response[
            "Access-Control-Allow-Headers"
        ] = "Content-Type, Authorization"  # Set allowed headers
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
        ema = EMA.objects.filter(stock_id=stock_id).order_by("-profit").first()

        if ema is None:
            return Response({"detail": "No EMAs found for this stock."}, status=404)

        serializer = self.get_serializer(ema)
        return Response(serializer.data)


class AllEMAPeriodsView(generics.ListAPIView):
    serializer_class = EMASerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        stock_id = self.kwargs["stock_id"]
        return EMA.objects.filter(stock_id=stock_id).order_by("period")
