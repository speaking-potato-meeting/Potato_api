from apscheduler.schedulers.background import BackgroundScheduler

from .views import week_hours,daily_hours
from datetime import datetime

def start():

    scheduler=BackgroundScheduler()

    @scheduler.scheduled_job('cron',  hour='7', minute='45', id='test')
    def auto_check():
        if datetime.weekday==0:
            week_hours()
            daily_hours()
    scheduler.start()
