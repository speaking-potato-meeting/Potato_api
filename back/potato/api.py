from ninja import NinjaAPI, Schema
from .models import User,StudyTimer,TodoList
from django.shortcuts import get_object_or_404
from accounts.api import router as accounts_router
from schedule.api import router as schedule_router
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import User
from datetime import date
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from pydantic import BaseModel

# from django.contrib.auth.models import User

api  = NinjaAPI()


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
    user_id: int
    date: date

class TimerPause(Schema):
    user_id: int
    date : date
    study: int

# 타이머 생성
# @api.post('/timer',tags=["타이머"])
# def create_Timer(request, payload: TimerStart):
#     user = User.objects.get(id=payload.user_id)
#     time = StudyTimer.objects.create(user=user, study=payload.study)
#     return {"id":user.id, "studyTime": time.study}

# # 타이머 재생버튼
# @api.get('/timer/{timer_id}', tags=["타이머"])
# def read_Timer(request, timer_id: int, payload: TimerOut):
#     try:
#         user = User.objects.get(id=payload.user_id)
#         timer = StudyTimer.objects.get(id=timer_id)
#         timer.save()
        
#         return {"id": timer.user.id, "studyTime": timer.study}
#     except StudyTimer.DoesNotExist:
#         return {"message": "유저 정보가 아직 없음."}

# 타이머 재생 버튼
@api.post('/start_studying', tags=["타이머"])
def start_studying(request, payload: TimerStart):
    try:
        user = User.objects.get(id=payload.user_id)
        
        # 현재 날짜에 해당 유저의 공부 기록이 있는지 확인
        today_study_timer, created = StudyTimer.objects.get_or_create(user=user, date=payload.date)
        
        # is_studying을 True로 설정
        user.is_studying = True
        user.save()

        if today_study_timer:
            return {"message": "공부 시작!", "studyTimer": {"study": today_study_timer.study}}
        else:
            return {"message": "공부 시작!", "studyTimer": {}}
    except User.DoesNotExist:
        return {"message": "유저 정보가 아직 없음."}


# 타이머 일시 정지 버튼
@api.post('/pause_studying', tags=["타이머"])
def pause_studying(request, payload: TimerPause):
    try:
        user = User.objects.get(id=payload.user_id)
        
        # 현재 날짜에 해당 유저의 공부 기록이 있는지 확인
        today_study_timers = StudyTimer.objects.filter(user=user, date=payload.date)
        
        if today_study_timers.exists():
            # 이미 오늘 공부한 기록이 있으면 새로운 기록을 추가 (CREATE)
            today_study_timer = today_study_timers.first()
            today_study_timer.study += payload.study
            today_study_timer.save()
        else:
            # 오늘 공부한 기록이 없으면 새로운 레코드를 생성 (CREATE)
            today_study_timer = StudyTimer.objects.create(user=user, date=payload.date, study=payload.study)
        
        # is_studying을 False로 설정
        user.is_studying = False
        user.save()
        
        return {"message": "일시정지", "studyTimer": {"study": today_study_timer.study}}

    except User.DoesNotExist:
        return {"message": "유저 정보가 아직 없음."}


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