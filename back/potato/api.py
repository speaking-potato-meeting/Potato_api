from ninja import NinjaAPI, Schema
from .models import User,StudyTimer,TodoList
from django.shortcuts import get_object_or_404
from accounts.api import router as accounts_router
from money.api import router as money_router
from schedule.api import router as schedule_router
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User
from datetime import date, timedelta

# from django.contrib.auth.models import User

api  = NinjaAPI()

api.add_router("/money/", money_router)
api.add_router("/accounts/", accounts_router)
api.add_router("/schedule/", schedule_router)

#To-do-list
class TodoListSchema(Schema):
    user_id: int
    title: str
    description: str
    is_active: bool

#타이머스키마
class TimerStart(Schema):
    date : date
    user_id: int

class TimerPause(Schema):
    user_id: int
    date : date
    study: int
    
class StudyTimerOut(Schema):
    user_id: int
    date: date
    study: int

# 타이머 재생 버튼
@login_required
@api.post('/start_studying', tags=["타이머"])
def start_studying(request, payload: TimerStart):
    try:
        user = request.user
        
        today_study_timer, created = StudyTimer.objects.get_or_create(user=user, date=payload.date)
        
        # is_studying을 True로 설정
        user.is_studying = True
        user.save()

        if today_study_timer:
            return {"message": "공부 시작", "studyTimer": {"study": today_study_timer.study}}
        else:
            return {"message": "공부 시작", "studyTimer": {}}
    except User.DoesNotExist:
        return {"message": "유저 정보가 없음."}


@api.get("/study_timers/date_range/", tags=["타이머"])
def get_study_timers_in_date_range(request, from_date: date, to_date: date):
    # StudyTimer 모델에서 from_date와 to_date 사이의 데이터를 필터링
    study_timers = StudyTimer.objects.filter(date__range=[from_date, to_date])

    # 필터링된 결과를 StudyTimerOut 스키마에 맞게 변환하여 반환
    study_timer_list = [
        StudyTimerOut(
            user_id=study_timer.user_id,
            date=study_timer.date,
            study=study_timer.study,
        )
        for study_timer in study_timers
    ]
    return study_timer_list


# 타이머 일시 정지 버튼
@login_required
@api.post('/pause_studying', tags=["타이머"])
def pause_studying(request, payload: TimerPause):
    try:
        user = request.user
        
        today_study_timers = StudyTimer.objects.filter(user=user, date=payload.date)
        yesterday = payload.date - timedelta(days=1)
        out_of_date_study_timers = StudyTimer.objects.filter(user=user, date=yesterday)

        if today_study_timers.exists():
            today_study_timer = today_study_timers.first()
            today_study_timer.study = payload.study
            today_study_timer.save()
        elif user.is_studying == False: 
            today_study_timer = StudyTimer.objects.create(user=user, date=payload.date, study=payload.study)
        
        else:
            # 오늘 공부한 기록이 없으면 새로 생성 (CREATE)
            out_of_date_study_timer = out_of_date_study_timers.first()
            out_of_date_study_timer.study = payload.study
            out_of_date_study_timer.save()
        user.is_studying = False
        user.save()
        
        return {"message": "일시정지"}

    except User.DoesNotExist:
        return {"message": "유저 정보가 없음."}


# @api.post("/upload_image/{user_id}")
# def upload(request, file: UploadedFile = File(...)):
#      data = file.read()
#      return {'name': file.name, 'len': len(data)}
####################################################################


#TodoList생성
@api.post("/todolist/", response=TodoListSchema,tags=["todolist"])
def create_todolist(request, data: TodoListSchema):
    todo = TodoList(
        user_id=data.user_id,
        title=data.title,
        description=data.description,
        is_active=data.is_active
    )
    todo.save()
    return todo

#TodoList조회
@api.get("/todolist/{todo_id}", response=TodoListSchema,tags=["todolist"])
def get_todolist(request, todo_id: int):
    try:
        todo = TodoList.objects.get(id=todo_id)
        return todo
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404

#TodoList수정
@api.put("/todolist/{todo_id}", response=TodoListSchema,tags=["todolist"])
def update_todolist(request, todo_id: int, data: TodoListSchema):
    try:
        todo = TodoList.objects.get(id=todo_id)
        todo.user_id = data.user_id
        todo.title = data.title
        todo.description = data.description
        todo.is_active = data.is_active
        todo.save()
        return todo
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404

#TodoList삭제
@api.delete("/todolist/{todo_id}",tags=["todolist"])
def delete_todolist(request, todo_id: int):
    try:
        todo = TodoList.objects.get(id=todo_id)
        todo.delete()
        return {"message": "성공"}
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404