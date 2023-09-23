
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
class TimerIn(Schema):
    user_id: int
    date: date
    study: int
    is_active: bool

@api.post('/timer',tags=["타이머"])
def create_Timer(request, payload: TimerIn):
    user = User.objects.get(id=payload.user_id)
    time = StudyTimer.objects.create(user=user, studyTime=payload.study)
    return {"id":user.id, "studyTime": time.study}

@api.put('/timer/{user_id}',tags=["타이머"])
def update_Timer(request, user_id: int, payload: TimerIn):
    time = get_object_or_404(StudyTimer, id=user_id)
    time.study = payload.study
    time.save()
    return {"study": time.study}

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
        todo.user = data.user_id
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
