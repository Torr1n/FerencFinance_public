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
router.register(
    r"portfolio", ferencfinance_views.PortfolioViewSet, basename="portfolio"
)

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
    path(
        "<uuid:stock_id>/all_ema_periods/",
        ferencfinance_views.AllEMAPeriodsView.as_view(),
        name="all-ema-periods",
    ),
    path(
        "<uuid:portfolio_id>/all_highest_emas/",
        ferencfinance_views.AllStocksHighestProfitEMAView.as_view(),
        name="all highest emas",
    ),
    path(
        "update_all_stocks/",
        ferencfinance_views.UpdateAllStocksView.as_view(),
        name="update all stocks",
    ),
    path(
        "<uuid:portfolio_id>/stocks_excel_export/",
        ferencfinance_views.AllStocksExcelExportView.as_view(),
        name="stocks_excel_export",
    ),
    path(
        "<uuid:portfolio_id>/stocks/",
        ferencfinance_views.PortfolioStocksView.as_view(),
        name="portfolio-stocks",
    ),
]
