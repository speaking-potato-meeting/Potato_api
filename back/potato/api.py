from ninja import NinjaAPI
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment,User
from datetime import date, datetime
from ninja import Schema
from django.shortcuts import get_object_or_404
# from django.contrib.auth.models import User
from django.http import Http404
from datetime import date
from typing import Optional
from pydantic.networks import HttpUrl
from django.contrib.auth import authenticate, login, logout
from ninja.errors import HttpError

api  = NinjaAPI()

#댓글
class commentIn(Schema):
    user_id: int = None
    timestamp: date = None
    text: str

#댓글
class commentOut(Schema):
    id: int = None
    user_id: int = None
    timestamp: date = None
    text: str

#유저
class CreateUserin(Schema):
    username: str
    password: str
    email: str
    phone: str
    address: str
    github: str
    blog: Optional[HttpUrl] 
    MBTI: str
    position: str
    individual_rule: str
    birth: date

#유저
class CreateUserSchema(Schema):
    username: str
    password: str
    email: str
    phone: str
    address: str
    github: str
    blog: Optional[HttpUrl] 
    MBTI: str
    position: str
    individual_rule: str
    birth: date

#로그인/로그아웃   
class LoginInput(Schema):
    username: str
    password: str

#댓글생성
@api.post("/comments")
def create_Comment(request, payload: commentIn):
    user = User.objects.get(id=payload.user_id)  # Fetch the User instance
    comment = Comment.objects.create(user=user, text=payload.text)
    return {"id": comment.id, "timestamp": comment.timestamp}

#댓글조회
@api.get('/comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

#댓글수정
@api.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.user_id = payload.user_id
    comment.timestamp = payload.timestamp
    comment.text = payload.text
    comment.save()
    return {"success" : True}

#댓글삭제
@api.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}

#회원가입
@api.post("/create-user")
def create_user(request, data: CreateUserSchema):
    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password,
        phone = data.phone,
        address = data.address,
        github = data.github,
        blog = data.blog,
        MBTI = data.MBTI,
        postion = data.position,
        individual_rule = data.individual_rule,
        birth = data.birth,
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
            "postion": user.position,
            "individual_rule": user.individual_rule,
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
        user.individual_rule = data.individual_rule
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
        return {"message": "성공"}
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

