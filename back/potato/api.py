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

api  = NinjaAPI()

#댓글
class commentIn(Schema):
    user_id: int = None
    # user =1
    timestamp: date = None
    # timestamp = datetime.now()
    text: str
    # text = "확인"

class commentOut(Schema):
    id: int = None
    # id=1
    user_id: int = None
    # user =1
    timestamp: date = None
    # timestamp = datetime.now()
    text: str
    # text = "확인1"

@api.post("/comments")
def create_Comment(request, payload: commentIn):
    user = User.objects.get(id=payload.user_id)  # Fetch the User instance
    comment = Comment.objects.create(user=user, text=payload.text)
    return {"id": comment.id, "timestamp": comment.timestamp}

@api.get('/comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

@api.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.user_id = payload.user_id
    comment.timestamp = payload.timestamp
    comment.text = payload.text
    comment.save()
    return {"success" : True}

@api.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}
#댓글

class CreateUserin(Schema):
    username: str
    password: str
    email: str
    phone: str
    address: str
    github: str
    blog: Optional[HttpUrl] 
    MBTI: str
    postion: str
    individual_rule: str
    birth: date

class CreateUserSchema(Schema):
    username: str
    password: str
    email: str
    phone: str
    address: str
    github: str
    blog: Optional[HttpUrl] 
    MBTI: str
    postion: str
    individual_rule: str
    birth: date

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
        postion = data.postion,
        individual_rule = data.individual_rule,
        birth = data.birth,
    )
    user.save()
    return {"message": "성공"}

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
            "postion": user.postion,
            "individual_rule": user.individual_rule,
            "birth": user.birth.strftime('%Y-%m-%d'),
        }
        return serialized_user
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
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
        user.postion = data.postion
        user.individual_rule = data.individual_rule
        user.birth = data.birth
        user.save()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
@api.delete("/delete-user/{user_id}")
def delete_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404