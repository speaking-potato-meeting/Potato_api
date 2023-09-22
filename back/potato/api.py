from ninja import NinjaAPI, File, Schema, Router, Path
from ninja.files import UploadedFile
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment,User,Timer,TodoList
from datetime import date, datetime
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from pydantic import BaseModel
import logging
import os
# from django.contrib.auth.models import User
from django.http import Http404
from typing import Optional
from pydantic.networks import HttpUrl
from django.contrib.auth import authenticate, login, logout
from ninja.errors import HttpError
from django.http import HttpResponse

api  = NinjaAPI()
logger = logging.getLogger(__name__)


#댓글
class commentIn(Schema):
    # user_id: int = None
    # timestamp: date = None
    text: str

#댓글
class CommentOut(Schema):
    user_id: int
    text: str
    timestamp: date 

#유저
class CreateUserSchema(Schema):
    email: str
    password: str
    username: str
    birth: date
    address: str
    phone: str
    MBTI: str
    position: str
    github: str
    blog: Optional[HttpUrl] 
    # individual_rule: str

#To-do-list
class TodoListSchema(Schema):
    user_id: int
    title: str
    date: date  
    description: str
    is_active: bool

#로그인/로그아웃   
class LoginInput(Schema):
    username: str
    password: str
    # email: str
    # phone: str
    # address: str
    # github: str
    # postion: str
    # individual_rule: str
    # birth: date
    # is_admin: bool
    # is_active: bool
    # is_staff: bool
    # is_superuser: bool

class TimerIn(Schema):
    user_id: int
    username: str
    studyTime: str
    date: date

class UserInfo(BaseModel):
    user_id: int
    username: str
users = []


#댓글생성
@api.post("/comments")
def create_Comment(request, payload: commentIn):
    try:
        user = User.objects.get(id=payload.user_id)  # Fetch the User instance
        comment = Comment.objects.create(user=user, text=payload.text)
        return {"id": comment.id, "timestamp": comment.timestamp}
    except Exception as e:
        #오류 로깅
        logger.exception("An error occurred: %s", e)
        return HttpResponseServerError("서버 오류 발생")

# 전체 댓글 목록을 가져오는 엔드포인트
@api.get("/comments/")
def get_all_comments(request):
    comments = Comment.objects.all()
    comment_data = [{"id": comment.id, "text": comment.text, "timestamp": comment.timestamp} for comment in comments]
    return comment_data

#댓글조회
@api.get('/comments/{comment_id}')
def get_comment(request, comment_id: int):
    try:
        comment = Comment.objects.get(id=comment_id)
        return {"username": comment.user.username , "text":comment.text , "timestamp": comment.timestamp }
    except Comment.DoesNotExist:
        return {"message": "Comment not found"}, 404

#댓글수정
@api.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    # comment.user_id = payload.user_id
    # comment.timestamp = payload.timestamp 기본
    # comment.timestamp = datetime.now()현재시간
    comment.text = payload.text
    comment.save()
    return {"username": comment.user.username , "text":comment.text }

#댓글삭제
@api.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}


@api.get("/user/{user_id}")
def get_user(request, user_id: int):
    # 사용자 정보를 데이터베이스에서 가져오는 로직을 구현하세요.
    user = {"id": user_id, "username": "example_user"}  # 예시 데이터
    return user

@api.delete('/user/{user_id}')
def delete_User(request,user_id: int):
    user =  get_object_or_404(User, id=user_id)
    user.delete()
    return {"success": True}

@api.post('/timer')
def create_Timer(request, payload: TimerIn):
    user = User.objects.get(id=payload.user_id)
    time = Timer.objects.create(user=user, studyTime=payload.studyTime)
    return {"id":user.id, "studyTime": time.studyTime}

@api.put('/timer/{user_id}')
def update_Timer(request, user_id: int, payload: TimerIn):
    time = get_object_or_404(Timer, id=user_id)
    time.studyTime = payload.studyTime
    time.save()
    return {"studyTime": time.studyTime}

# @api.post("/upload_image/{user_id}")
# def upload(request, file: UploadedFile = File(...)):
#      data = file.read()
#      return {'name': file.name, 'len': len(data)}
####################################################################

@api.post("/user/{user_id}/upload")
def upload_photo(request, user_id: int, file: UploadedFile = File(...)):
    # 업로드된 파일 저장 경로 설정
    upload_dir = "uploads"  
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.name)

    # 이미지 파일 저장
    with open(file_path, 'wb') as f:
        f.write(file.read())

    for user in users:
        if user.user_id== user_id:
            user.profile_image = file_path
            break

    return {"message": "Image uploaded Successfully"}

@api.get("/users/{user_id}", response=UserInfo)
def get_user_info(request, user_id: int = Path(..., description="User ID")):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return 404, {"error":"User not found"}

    user_data = {
        "user_id": user_id,
        "username": user.username,
        "email": user.email,
    }

    return user_data
#회원가입
@api.post("/create-user")
def create_user(request, data: CreateUserSchema):
    user = User.objects.create_user(
        email=data.email,
        password=data.password,
        username=data.username,
        birth = data.birth,
        address = data.address,
        phone = data.phone,
        MBTI = data.MBTI,
        position = data.position,
        github = data.github,
        blog = data.blog,
        # individual_rule = data.individual_rule,
    )
    user.save()
    return {"message": "성공"}

#회원조회
@api.get("/get-user/{user_id}")
def get_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)

        serialized_user = {
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "github": user.github,
            "blog": user.blog,
            "MBTI": user.MBTI,
            "position": user.position,
            # "individual_rule": user.individual_rule,
            "birth": user.birth.strftime('%Y-%m-%d'),
        }
        return serialized_user
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
#회원수정
@api.put("/update-user/{user_id}")
def update_user(request, user_id: int, data: CreateUserSchema):
    try:
        user = User.objects.get(id=user_id)
        user.username = data.username
        user.password=data.password
        user.email = data.email
        user.phone = data.phone
        user.address = data.address
        user.github = data.github
        user.blog = data.blog
        user.MBTI = data.MBTI
        user.position = data.position
        # user.individual_rule = data.individual_rule
        user.birth = data.birth
        user.save()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
#회원탈퇴    
@api.delete("/delete-user/{user_id}")
def delete_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404

#로그인
@api.post("/login")
def login_user(request, data: LoginInput):
    user = authenticate(request, username=data.username, password=data.password)
    if user is not None:
        login(request, user)
        request.session['user_id'] = user.id 
        return HttpResponse("Login successful")
    else:
        raise HttpError(401, "실패")
    
#로그아웃
@api.post("/logout")
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return {"message": "성공"}
    else:
        raise HttpError(401, "실패")

#TodoList생성
@api.post("/todolist/", response=TodoListSchema)
def create_todolist(request, data: TodoListSchema):
    todo = TodoList(
        user_id=data.user_id,
        title=data.title,
        date=data.date,
        description=data.description,
        is_active=data.is_active
    )
    todo.save()
    return todo

#TodoList조회
@api.get("/todolist/{todo_id}", response=TodoListSchema)
def get_todolist(request, todo_id: int):
    try:
        todo = TodoList.objects.get(id=todo_id)
        return todo
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404

#TodoList수정
@api.put("/todolist/{todo_id}", response=TodoListSchema)
def update_todolist(request, todo_id: int, data: TodoListSchema):
    try:
        todo = TodoList.objects.get(id=todo_id)
        todo.user_id = data.user_id
        todo.title = data.title
        todo.date = data.date
        todo.description = data.description
        todo.is_active = data.is_active
        todo.save()
        return todo
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404

#TodoList삭제
@api.delete("/todolist/{todo_id}")
def delete_todolist(request, todo_id: int):
    try:
        todo = TodoList.objects.get(id=todo_id)
        todo.delete()
        return {"message": "성공"}
    except TodoList.DoesNotExist:
        return {"message": "실패"}, 404
