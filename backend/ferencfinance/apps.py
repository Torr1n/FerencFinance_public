from django.apps import AppConfig


class FerencfinanceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ferencfinance"

    def ready(self):
        import ferencfinance.signals
