from django.apps import AppConfig
from django.conf import settings

class MoneyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'money'

    def ready(self):
        if settings.SCHEDULER_DEFAULT:
            from . import operator
            operator.start()
