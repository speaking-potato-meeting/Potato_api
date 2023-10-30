from apscheduler.schedulers.background import BackgroundScheduler

from .views import week_hours,daily_hours
from datetime import datetime

def start():

    scheduler=BackgroundScheduler()

    @scheduler.scheduled_job('cron',  hour='15', minute='30', id='test')
    def auto_check():
        if datetime.weekday==1:
            week_hours()
            daily_hours()
    scheduler.start()
