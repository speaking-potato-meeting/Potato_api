from ninja import Schema, Router, Path, Query
from potato.models import Comment, User, Schedule
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from django.contrib.auth.decorators import login_required
from datetime import date,timedelta
from pydantic import BaseModel
from typing import List, Optional
import logging
from django.contrib.auth.decorators import user_passes_test#슈퍼유저만
from django.http import HttpResponse
from django.utils import timezone
router = Router()
logger = logging.getLogger(__name__)

def is_staff_user(user):
    return user.is_staff

class CommentIn(Schema):
    schedule_id: int
    text: str


class CommentOut(Schema):
    id: int
    schedule_id: int
    username: str
    timestamp: date
    text: str

class ScheduleIn(Schema):
    start_date: date
    schedule: str
    is_holiday: bool
    
class ScheduleOut(Schema):
    id: int
    start_date: date
    schedule: str
    is_holiday: bool
    category: str
    # is_staff:bool#스태프 여부

# 댓글 작성 (특정 스케줄에 맞춰)
@router.post("/schedules/{schedule_id}/comments", tags=["코멘트"])
@login_required
def create_Comment(request, schedule_id:int, payload: CommentIn):
    schedule_id = payload.schedule_id
    user = request.user
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        comment = Comment.objects.create(text=payload.text, schedule=schedule,user=user)
        comment.save()
        user_info=User.objects.get(id=user.id)
        user_data = {#해당 유저 정보
            "id": user_info.id,
            "profile_image": user_info.profile_image.url if user_info.profile_image else None
        }
        response_data = {
            "comment": {
                "id": comment.id,
                "schedule_id": comment.schedule.id,
                "user_id": user.id,
                "timestamp": comment.timestamp,
                "text": comment.text,
            },
            "user_info": user_data,
        }
        return response_data
    except Schedule.DoesNotExist:
        return {"error": "Schedule not found"}

# 해당 일정에 작성된 코멘트 불러오기
@router.get("/schedules/{schedule_id}/comments", tags=["코멘트"])
def get_comments_for_schedule(request,schedule_id: int):
    try:
        comments = Comment.objects.filter(schedule_id=schedule_id)
        comment_list = []
        for comment in comments:
            user_info = User.objects.get(id=comment.user.id)
            user_data = {
                "id": user_info.id,
                "profile_image": user_info.profile_image.url if user_info.profile_image else None
            }
            comment_data = {
                "id": comment.id,
                "schedule_id": comment.schedule.id,
                "user_id": user_info.id,
                "timestamp": comment.timestamp,
                "text": comment.text,
                "user_info": user_data
            }
            comment_list.append(comment_data)
        return comment_list

    except Comment.DoesNotExist:
        return {"error": "Comments not found"}

    
# 유저별 작성한 코멘트 불러오기
@router.get("/users/{user_id}/comments", tags=["코멘트"])
def get_comments_by_user(user_id: int):
    try:
        comments = Comment.objects.filter(user_id=user_id)
        comment_list = []
        for comment in comments:
            user_info = User.objects.get(id=comment.user.id)
            user_data = {
                "id": user_info.id,
                "profile_image": user_info.profile_image.url if user_info.profile_image else None
            }
            comment_data = {
                "id": comment.id,
                "schedule_id": comment.schedule.id,
                "user_id": user_info.id,
                "timestamp": comment.timestamp,
                "text": comment.text,
                "user_info": user_data
            }
            comment_list.append(comment_data)
        return comment_list

    except Comment.DoesNotExist:
        return {"error": "Comments not found"}

# 댓글 수정
@router.put("/comments/{comment_id}", tags=["코멘트"])
@login_required
def update_comment(request, comment_id: int, payload: CommentIn):
    try:
        comment = Comment.objects.get(id=comment_id)
        comment.text = payload.text
        comment.save()

        user_info=User.objects.get(id=comment.user.id)
        user_data = {#해당 유저 정보
            "id": user_info.id,
            "profile_image": user_info.profile_image.url if user_info.profile_image else None
        }
        response_data = {
            "comment": {
                "id": comment.id,
                "schedule_id": comment.schedule.id,
                "user_id": comment.user.id,
                "timestamp": comment.timestamp,
                "text": comment.text,
            },
            "user_info": user_data,
        }
        return response_data
    except Comment.DoesNotExist:
        return 404, {"error": "Comment not found"}

# 댓글 삭제
@router.delete("/comments/{comment_id}", tags=["코멘트"])
@login_required
def delete_comment(request, comment_id: int):
    try:
        comment = Comment.objects.get(id=comment_id)
        comment.delete()
        return {"success" : True}
    except Comment.DoesNotExist:
        return 404, {"error": "Comment not found"}

#####################################################################
#####################################################################

# 스케줄 생성
@router.post("/schedules/", tags=["스케줄"])
@user_passes_test(lambda u: u.is_staff)
@login_required
def create_schedule(request,payload:ScheduleIn):
    if request.user.is_staff:
        schedule = Schedule.objects.create(
            start_date = payload.start_date,
            end_date = payload.start_date,
            schedule = payload.schedule,
            is_holiday = payload.is_holiday,
            category="일정"
        )
        schedule.save()
        return {"id": schedule.id,
                "start_date": schedule.start_date,
                "schedule": schedule.schedule,
                "is_holiday": schedule.is_holiday,
                "category":schedule.category
                }
    else:
        response = HttpResponse("권한이 없습니다.")
        response.status_code = 403
        return response
    
#1년 스케줄 생성(카테고리 출석)
@router.post("/create_yearly_schedules", tags=["스케줄"])
@user_passes_test(lambda u: u.is_staff)
@login_required
def create_yearly_schedules(request):
    # 시작일과 끝일 설정
    today = timezone.now()
    end_date = today + timedelta(days=365)  # 1년 후

    # 스케줄 생성
    while today <= end_date:

        day_of_week = today.weekday()

        # 주말제외
        if day_of_week != 6 and day_of_week != 5:
            schedule = Schedule.objects.create(
                start_date=today,
                end_date=today,
                schedule="일일 스케줄",
                is_holiday=False,
                category='출석',  # 또는 '일정'으로 변경 가능
            )
            schedule.save()

        today += timedelta(days=1)
    
    return {"message": "1년 동안의 스케줄이 생성되었습니다."}   

# 특정 스케줄 조회
@router.get("/schedules/{schedule_id}/", tags=["스케줄"], response=ScheduleOut)
def get_schedule(request, schedule_id: int):
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        return ScheduleOut(
            id=schedule.id,
            start_date=schedule.start_date,
            end_date=schedule.start_date,
            schedule=schedule.schedule,
            is_holiday=schedule.is_holiday,
            category=schedule.category
        )
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 스케줄조회
@router.get("/schedules/", response=List[ScheduleOut], tags=["스케줄"])
def get_schedules_in_date_range(request, from_date: date, to_date: date):
    schedules = Schedule.objects.filter(start_date__gte=from_date, start_date__lte=to_date)
    # 조회된 스케줄을 ScheduleOut 형태로 변환하여 응답
    schedule_list = []
    for schedule in schedules:
        schedule_data = {
            "id": schedule.id,
            "start_date": schedule.start_date,
            "schedule": schedule.schedule,
            "is_holiday": schedule.is_holiday,
            "category":schedule.category
        }
        schedule_list.append(ScheduleOut(**schedule_data))
    
    return schedule_list

# 특정 스케줄 수정
@router.put("/schedules/{schedule_id}/", tags=["스케줄"], response=ScheduleOut)
@user_passes_test(lambda u: u.is_staff)
@login_required
def update_schedule(request, schedule_id: int, payload: ScheduleIn):
    if request.user.is_staff:
        try:
            schedule = Schedule.objects.get(id=schedule_id)
            schedule.start_date = payload.start_date
            schedule.end_date = payload.start_date
            schedule.schedule = payload.schedule
            schedule.is_holiday = payload.is_holiday
            schedule.category=payload.category
            schedule.save()

            return ScheduleOut(
                id=schedule.id,
                start_date=schedule.start_date,
                end_date=schedule.end_date,
                schedule=schedule.schedule,
                is_holiday=schedule.is_holiday,
                category=payload.category,
                is_staff=True
            )
        except Schedule.DoesNotExist:
            return 404, {"error": "Schedule not found"}
    else:
        response = HttpResponse("권한이 없습니다.")
        response.status_code = 403
        return response
        
# 특정 스케줄 삭제
@router.delete("/schedules/{schedule_id}/", tags=["스케줄"])
@user_passes_test(lambda u: u.is_staff)
@login_required
def delete_schedule(request, schedule_id: int):
    if request.user.is_staff:
        try:
            schedule = Schedule.objects.get(id=schedule_id)
            schedule.delete()  # 스케줄 삭제
            return {"success": True,"is_staff":True}
        
        except Schedule.DoesNotExist:
            return 404, {"error": "Schedule not found"}
    else:
        response = HttpResponse("권한이 없습니다.")
        response.status_code = 403
        return response