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
    # user = 1
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = '확인'

class commentOut(Schema):
    id: int
    user: int 
    # user = 1
    timestamp: date
    # timestamp = datetime.now()
    text: str
    # text = '확인'


@api.post("/comments")
def create_Comment(request, payload: commentIn):
    comment = Comment.objects.create(**payload.dict())
    return {'id': comment.id}

@api.get('comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

