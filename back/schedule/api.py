from ninja import Schema, Router
from potato.models import Comment, User
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from datetime import date
import logging

router = Router()
logger = logging.getLogger(__name__)

class commentIn(Schema):
    user_id: int
    timestamp: date
    text: str
    schedule_id:int

class commentOut(Schema):
    id: int
    user_id: int
    timestamp: date
    text: str


@router.post("/comments",tags=["댓글"])
def create_Comment(request, payload: commentIn):
    try:
        user = User.objects.get(id=payload.user_id)  # Fetch the User instance
        comment = Comment.objects.create(user=user, text=payload.text)
        return {"id": comment.id, "timestamp": comment.timestamp}
    except Exception as e:
        #오류 로깅
        logger.exception("An error occurred: %s", e)
        return HttpResponseServerError("서버 오류 발생")
    
@router.get('/comments/{comment_id}', response=commentOut,tags=["댓글"])
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

# 전체 댓글 목록을 가져오는 엔드포인트
@router.get("/comments/",tags=["댓글"])
def get_all_comments(request):
    comments = Comment.objects.all()
    comment_data = [{"id": comment.id, "text": comment.text, "timestamp": comment.timestamp} for comment in comments]
    return comment_data

@router.put("/comments/{comment_id}",tags=["댓글"])
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.user_id = payload.user_id
    comment.timestamp = payload.timestamp
    comment.text = payload.text
    comment.save()
    return {"success" : True}

@router.delete("/comments/{comment_id}",tags=["댓글"])
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}