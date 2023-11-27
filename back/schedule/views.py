from django.shortcuts import render
from datetime import timedelta
from django.utils import timezone
from potato.models import Schedule

# Create your views here.
def create_yearly_schedules():
    # 시작일과 끝일 설정
    today = timezone.now()
    end_date = today + timedelta(days=365)  # 1년 후

    # 스케줄 생성
    while today <= end_date:

        day_of_week = today.weekday()

        # 주말제외
        if day_of_week != 6 and day_of_week != 5:
            schedule = Schedule.objects.create(
                start_date=today,
                end_date=today,
                schedule="일일 스케줄",
                is_holiday=False,
                category='출석',
            )
            schedule.save()

        today += timedelta(days=1)
    
    return {"message": "1년 동안의 스케줄이 생성되었습니다."}   
