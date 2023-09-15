from ninja import NinjaAPI
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment
from datetime import date, datetime
from ninja import Schema
from django.shortcuts import get_object_or_404


api  = NinjaAPI()

class commentIn(Schema):
    user: int
    # user = 2
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = '확인1'

class commentOut(Schema):
    id: int
    # id =1
    user: int
    # user = 2
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = '확인2'

@api.post("/comments")
def create_Comment(request, payload: commentIn):
    
    comment = Comment.objects.create(**payload.dict())
    return {'id': comment.id}

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