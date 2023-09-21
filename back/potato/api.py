from ninja import NinjaAPI, File, Schema, Router, Path
from ninja.files import UploadedFile
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import Comment,User,Timer
from datetime import date
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from pydantic import BaseModel
import logging
import os

router = Router()
api  = NinjaAPI()
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

class TimerIn(Schema):
    user_id: int
    username: str
    studyTime: str
    date: date

class UserInfo(BaseModel):
    user_id: int
    username: str
users = []


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
    
@api.get('/comments/{comment_id}', response=commentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

# 전체 댓글 목록을 가져오는 엔드포인트
@api.get("/comments/")
def get_all_comments(request):
    comments = Comment.objects.all()
    comment_data = [{"id": comment.id, "text": comment.text, "timestamp": comment.timestamp} for comment in comments]
    return comment_data

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
    users.append(user)
    return {"id":user.id}

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