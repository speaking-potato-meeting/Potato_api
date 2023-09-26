from ninja import File, Schema, Path, Router
from ninja.files import UploadedFile
from potato.models import User
from datetime import date
from django.shortcuts import get_object_or_404
from pydantic import BaseModel
from typing import Optional
from pydantic.networks import HttpUrl
from django.contrib.auth import authenticate, login, logout
from ninja.errors import HttpError
import logging
import os
from django.contrib.auth.hashers import make_password #해시화
router = Router()
logger = logging.getLogger(__name__)


#유저

class CreateUserSchema(Schema):
    username: str
    password: str
    first_name: str
    birth: date
    address: str
    github: str
    phone: str
    MBTI: str
    position: str
    blog: Optional[HttpUrl]
    total_fee : int 
    week_studytime:int
    penalty:int
    immunity:int
    # profile_image:
    # individual_rule: str

#로그인/로그아웃   
class LoginInput(Schema):
    username: str
    password: str
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

class UserInfo(BaseModel):
    user_id: int
    username: str
users = []



@router.get("/user/{user_id}")
def get_user(request, user_id: int):
    # 사용자 정보를 데이터베이스에서 가져오는 로직을 구현하세요.
    user = {"id": user_id, "username": "example_user"}  # 예시 데이터
    return user

@router.delete('/user/{user_id}')
def delete_User(request,user_id: int):
    user =  get_object_or_404(User, id=user_id)
    user.delete()
    return {"success": True}

#유저 이미지파일
@router.post("/user/{user_id}/upload")
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

@router.get("/users/{user_id}", response=UserInfo)
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
@router.post("/create-user", tags=["회원가입"])
def create_user(request, data: CreateUserSchema):
    user = User.objects.create_user(
        username=data.username,
        password=data.password,
        first_name=data.first_name,
        birth = data.birth,
        address = data.address,
        phone = data.phone,
        MBTI = data.MBTI,
        position = data.position,
        github = data.github,
        blog = data.blog,
        total_fee = data.total_fee,
        week_studytime = data.week_studytime,
        penalty = data.penalty,
        immunity = data.immunity,
        # profile_image:
        # individual_rule = data.individual_rule,
    )
    user.save()
    return {"message": "성공"}

#회원조회
@router.get("/get-user/{user_id}",tags=["회원가입"])
def get_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)

        serialized_user = {
            "username": user.username,
            "first_name":user.first_name,
            "phone": user.phone,
            "address": user.address,
            "github": user.github,
            "blog": user.blog,
            "MBTI": user.MBTI,
            "position": user.position,
            "birth": user.birth.strftime('%Y-%m-%d'),
            # "individual_rule": user.individual_rule,
        }
        return serialized_user
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
#회원수정
@router.put("/update-user/{user_id}", tags=["회원가입"])
def update_user(request, user_id: int, data: CreateUserSchema):
    
    try:
        user = User.objects.get(id=user_id)
        if data.password:#수정시 비밀번호 해시화
            hashed_password = make_password(data.password)
            user.password = hashed_password
        user.username = data.username
        user.first_name= data.first_name
        user.phone = data.phone
        user.address = data.address
        user.github = data.github
        user.blog = data.blog
        user.MBTI = data.MBTI
        user.position = data.position
        # user.profile_image=data
        # user.individual_rule = data.individual_rule
        user.birth = data.birth
        user.save()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
#회원탈퇴    
@router.delete("/delete-user/{user_id}", tags=["회원가입"])
def delete_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return {"message": "성공"}
    except User.DoesNotExist:
        return {"message": "실패"}, 404

#로그인
@router.post("/login", tags=["로그인/로그아웃"])
def login_user(request, data: LoginInput):
    user = authenticate(request, username=data.username, password=data.password)

    if user is not None:

        login(request, user)

        return {"message": "성공"}
    else:
        raise HttpError(401, "실패")
    
#로그아웃
@router.post("/logout", tags=["로그인/로그아웃"])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return {"message": "성공"}
    else:
        raise HttpError(401, "실패")
