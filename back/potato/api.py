from ninja import NinjaAPI
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment,User
from datetime import date, datetime
from ninja import Schema
from django.shortcuts import get_object_or_404



api  = NinjaAPI()

class commentIn(Schema):
    user_id: int
    # user =1
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = "확인"


class commentOut(Schema):
    id: int
    # id=1
    user_id: int
    # user =1
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = "확인1"

class userIn(Schema):
    username: str
    password: str
    email: str
    phone: str
    address: str
    github: str
    postion: str
    individual_rule: str
    birth: date
    is_admin: bool
    is_active: bool
    is_staff: bool
    is_superuser: bool




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

@api.post('/user')
def create_User(request, payload: userIn):
    user = User.objects.create(**payload.dict())
    return {"id":user.id}

@api.delete('/user/{user_id}')
def delete_User(request,user_id: int):
    user =  get_object_or_404(User, id=user_id)
    user.delete()
    return {"success": True}