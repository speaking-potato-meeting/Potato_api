from apscheduler.schedulers.background import BackgroundScheduler

from .views import create_yearly_schedules
from datetime import datetime

def start():

    scheduler=BackgroundScheduler()
    today=datetime.now()
    today_month=today.month 
    today_day=today.day
    @scheduler.scheduled_job('cron', month=today_month,day=today_day,hour='15', minute='9', id='test')
    def auto_check():
        create_yearly_schedules()
    scheduler.start()