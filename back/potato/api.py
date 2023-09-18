from ninja import NinjaAPI
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment,User
from datetime import date, datetime
from ninja import Schema
from django.shortcuts import get_object_or_404



api  = NinjaAPI()

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


@api.get('comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

@api.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    for attr, value, in payload.dict().items():
        setattr(comment,attr,value)
    comment.save()
    return {"success" : True}

@api.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}