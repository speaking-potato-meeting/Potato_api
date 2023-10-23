from django.shortcuts import render
from potato.models import User,StudyTimer,Schedule,Money
from datetime import datetime,timedelta
from django.db.models import F,Q


today = datetime.now().date()- timedelta(days=3)
start_date = today - timedelta(days=7)# 지난주 월요일
end_date = today - timedelta(days=3)  # 지난 주 금요일까지

# #스터디일수
# search_string="여부"
# study_days = Schedule.objects.filter(start_date__range=(start_date, end_date), is_holiday=False,schedule__icontains=search_string).count()

# #벌금 day,week
# filter_condition = Q(individual_rule_content__icontains="+_+") | Q(individual_rule_content__icontains="0_0")
# filtered_money = Money.objects.filter(filter_condition)

def week_hours():

    week_end = today - timedelta(days=1)  # 지난 주 일요일까지
    # 데이터베이스 쿼리: 지난 주 월요일부터 일요일까지의 데이터 검색
    week_data = StudyTimer.objects.filter(date__range=(start_date, week_end))

    user_week_studytime = {}  # 유저별 주간 학습 시간을 저장할 딕셔너리

    for data in week_data:  # 타이머
        user_id = data.user_id  # FK
        study_time = data.study  # 초단위 시간
        if user_id not in user_week_studytime:
            user_week_studytime[user_id] = study_time
        else:
            user_week_studytime[user_id] += study_time

    # 유저 모델 업데이트 - 주간 학습 시간
    users = User.objects.all()
    for user in users:
        user_id = user.id

        if user_id in user_week_studytime:
            user.week_studytime = user_week_studytime[user_id]
            if user.week_studytime < 108000:  # 주간시간/5 (초로 환산)
                user.penalty += 1
                user.save()
        else:#주간 시간 목록에없다면
            user.penalty += 1
            user.save()

    #패널티/면제권 환산
    User.objects.filter(penalty__gte=1, immunity__gte=1).update(penalty=F('penalty') - 1, immunity=F('immunity') - 1)
    return "성공"

def daily_hours():
    # 데이터베이스 쿼리: 지난 주 월요일부터 금요일까지의 데이터 검색
    daily_data = StudyTimer.objects.filter(date__range=(start_date, end_date))   

    # 유저별 일일 학습 시간을 저장할 딕셔너리
    user_day_studytime = {}

    for data in daily_data:
        user_id = data.user_id
        study_time = data.study
        study_date = data.date

        if user_id not in user_day_studytime:
            user_day_studytime[user_id] = {}

        if study_date not in user_day_studytime[user_id]:
            user_day_studytime[user_id][study_date] = study_time
        else:
            user_day_studytime[user_id][study_date] += study_time

    #user_day_studytime.items()에 없는 유저/필터없는 유저
    users= User.objects.all()
    for all_user in users:
        if all_user.id not in user_day_studytime:
            all_user.total_fee += 15000#누적 때문에 추가
            all_user.save()

    #이제 user_day_studytime를 사용하여 유저별로 일일 학습 시간을 저장할 수 있습니다.
    for user_id, daily_data in user_day_studytime.items():
        get_user = User.objects.get(id=user_id)
        missing_days = 5 - len(daily_data)
        if missing_days > 0:
            get_user.total_fee += missing_days * 3000#데이터 부족수 
            if all(time < 7200 for time in daily_data.values()):#유저별 시간 
                get_user.total_fee += 3000
            get_user.save()
        elif missing_days == 0 and all(time < 7200 for time in daily_data.values()):#유저별 시간 
            get_user.total_fee += 3000
            get_user.save()

    return "성공"
