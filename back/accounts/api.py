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
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test#슈퍼유저만
from django.http import HttpResponse
router = Router()
logger = logging.getLogger(__name__)


#유저

class CreateUserSchema(Schema):
    username: str
    password: str
    first_name: str
    birth: date
    address: str
    github: Optional[HttpUrl]
    phone: str
    MBTI: str
    position: str
    blog: Optional[HttpUrl]
    # profile_image:
    
class updateUserSchema(Schema):
    username: str
    password: str
    first_name: str
    birth: date
    address: str
    github: Optional[HttpUrl]
    phone: str
    MBTI: str
    position: str
    blog: Optional[HttpUrl]
    # profile_image:

#관리자    
class admin_put(Schema):
    individual_rule: list
    total_fee: int
    penalty: int
    immunity: int

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

# @router.get("/users/{user_id}", response=UserInfo)
# def get_user_info(request, user_id: int = Path(..., description="User ID")):
#     try:
#         user = User.objects.get(id=user_id)
#     except User.DoesNotExist:
#         return 404, {"error":"User not found"}

#     user_data = {
#         "user_id": user_id,
#         "username": user.username,
#         "email": user.email,
#     }

#     return user_data

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
        # profile_image:,
    )
    user.save()
    user_data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "birth": user.birth,
        "address": user.address,
        "phone": user.phone,
        "MBTI": user.MBTI,
        "position": user.position,
        "github": user.github,
        "blog": user.blog,
        # Add other fields as needed
    }
    return user_data

#회원조회
@router.get("/get-user/{user_id}", tags=["회원가입"])
@login_required
def get_user(request, user_id: int):
    try:
        if user_id == request.user.id:
            user = User.objects.get(id=user_id)
            serialized_user = {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "phone": user.phone,
                "address": user.address,
                "github": user.github,
                "blog": user.blog,
                "MBTI": user.MBTI,
                "position": user.position,
                "birth": user.birth.strftime('%Y-%m-%d'),
            }
            return serialized_user
        else:
            response = HttpResponse("권한이 없습니다.")
            response.status_code = 403
            return response
    except User.DoesNotExist:
        return {"message": "사용자가 존재하지 않습니다."}, 404
    except Exception as e:
        return {"message": str(e)}, 500

#회원수정
@login_required
@router.put("/update-user/{user_id}", tags=["회원가입"])
def update_user(request, user_id: int, data: updateUserSchema):
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
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
            user.birth = data.birth
            # user.profile_image=data
            user.save()

            user_data = {
            "id": user.id,
            "password": user.password,
            "username": user.username,
            "first_name": user.first_name,
            "birth": user.birth,
            "address": user.address,
            "phone": user.phone,
            "MBTI": user.MBTI,
            "position": user.position,
            "github": user.github,
            "blog": user.blog,
            # user.profile_image=data
            }
            return user_data
        else:
            response = HttpResponse("권한이 없습니다.")
            response.status_code = 403
            return response
    except User.DoesNotExist:
        return {"message": "실패"}, 404
    
#회원탈퇴
@login_required
@router.delete("/delete-user/{user_id}", tags=["회원가입"])
def delete_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:

            data_user={
                "user_id":user.id
            }
            user.delete()
            return data_user
        else:
            response = HttpResponse("권한이 없습니다.")
            response.status_code = 403
            return response
    except User.DoesNotExist:
        return {"message": "실패"}, 404


#로그인
@router.post("/login", tags=["로그인/로그아웃/여부"])
def login_user(request, data: LoginInput):
    user = authenticate(request, username=data.username, password=data.password)
    if user is not None:
        login(request, user)
        user={
            "user_id":user.id
        }
        return user
    else:
        raise HttpError(401, "실패")
    
#로그아웃
@login_required
@router.post("/logout", tags=["로그인/로그아웃/여부"])
def logout_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "사용자를 찾을 수 없습니다."}, status=404)
    else:
        user={
            "user_id":request.user.id
        }
        logout(request)
        return user

    
@login_required#아니면 로그인
@router.get("/status", tags=["로그인/로그아웃/여부"])
def check_login_status(request):#로그인 여부
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        serialized_user = {
            "id":user.id,
            "username": user.username,
            "first_name":user.first_name,
            "phone": user.phone,
            "address": user.address,
            "github": user.github,
            "blog": user.blog,
            "MBTI": user.MBTI,
            "position": user.position,
            "birth": user.birth.strftime('%Y-%m-%d'),
            # profile_image:,
        }
        return serialized_user
    else:
        return JsonResponse({'is_logged_in': False})

@router.get("/admin_users", tags=["관리자페이지"])
@user_passes_test(lambda u: u.is_staff)
@login_required
def admin_page(request):
    if request.user.is_staff:
        try:
            users = User.objects.all()
            user_all = []
            for user in users:
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "total_fee": user.total_fee,
                    "week_studytime": user.week_studytime,
                }
                user_all.append(user_data)
            return user_all
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        response = HttpResponse("권한이 없습니다.")
        response.status_code = 403
        return response


    
@router.put("/admin_users/{user_id}", tags=["관리자페이지"])
@user_passes_test(lambda u: u.is_staff)
@login_required
def admin_page_update(request, user_id, data: admin_put):
    if request.user.is_staff:
        try:
            user = User.objects.get(id=user_id)
            user.individual_rule = data.individual_rule
            user.total_fee = data.total_fee
            user.penalty = data.penalty
            user.immunity = data.immunity
            user.save()
            user_data = {
                "id": user.id,
                "username": user.username,
                "total_fee": user.total_fee,
                "penalty": user.penalty,
                "immunity": user.immunity,
            }
            return user_data
        except User.DoesNotExist:
            return JsonResponse({"message": "사용자를 찾을 수 없습니다."}, status=404)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        response = HttpResponse("권한이 없습니다.")
        response.status_code = 403
        return response
   