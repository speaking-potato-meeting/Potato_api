from apscheduler.schedulers.background import BackgroundScheduler

from .views import test
from datetime import datetime

if datetime.today().weekday()==0:#월요일
    def start():

        scheduler=BackgroundScheduler()

        @scheduler.scheduled_job('cron',  hour='10', minute='20', id='test')#오전 4시15분
        def auto_check():
            test()
        scheduler.start()