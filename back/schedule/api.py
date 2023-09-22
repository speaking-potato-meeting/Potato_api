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


@router.post("/comments")
def create_Comment(request, payload: commentIn):
    try:
        user = User.objects.get(id=payload.user_id)  # Fetch the User instance
        comment = Comment.objects.create(user=user, text=payload.text)
        return {"id": comment.id, "timestamp": comment.timestamp}
    except Exception as e:
        #오류 로깅
        logger.exception("An error occurred: %s", e)
        return HttpResponseServerError("서버 오류 발생")
    
@router.get('/comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

# 전체 댓글 목록을 가져오는 엔드포인트
@router.get("/comments/")
def get_all_comments(request):
    comments = Comment.objects.all()
    comment_data = [{"id": comment.id, "text": comment.text, "timestamp": comment.timestamp} for comment in comments]
    return comment_data

@router.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: commentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.user_id = payload.user_id
    comment.timestamp = payload.timestamp
    comment.text = payload.text
    comment.save()
    return {"success" : True}

@router.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}