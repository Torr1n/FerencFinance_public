from django.urls import path
from django.urls import path
from django.contrib import admin
from core import views as core_views
from ecommerce import views as ecommerce_views
from ferencfinance import views as ferencfinance_views
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token


router = routers.DefaultRouter()
router.register(r"item", ecommerce_views.ItemViewSet, basename="item")
router.register(r"order", ecommerce_views.OrderViewSet, basename="order")
router.register(r"stock", ferencfinance_views.StockViewSet, basename="stock")
router.register(r"ema", ferencfinance_views.EMAViewSet, basename="ema")

urlpatterns = router.urls

urlpatterns += [
    path("admin/", admin.site.urls),
    path("contact/", core_views.ContactAPIView.as_view()),
    path("api-token-auth/", obtain_auth_token),
    path(
        "<uuid:stock_id>/highest_profit_ema/",
        ferencfinance_views.HighestProfitEMAView.as_view(),
        name="highest-profit-ema",
    ),
]
