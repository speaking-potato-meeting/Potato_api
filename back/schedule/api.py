from ninja import Schema, Router, Path, Query
from potato.models import Comment, User, Schedule
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
from django.contrib.auth.decorators import login_required
from datetime import date
from pydantic import BaseModel
from typing import List, Optional
import logging

router = Router()
logger = logging.getLogger(__name__)

class CommentIn(Schema):
    schedule_id: int
    user_id: int
    timestamp: date
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
    end_date: date
    schedule: str
    is_holiday: bool

# 댓글 작성 (특정 스케줄에 맞춰)
@router.post("/comments", tags=["코멘트"])
@login_required
def create_Comment(request, payload: CommentIn):
    schedule_id = payload.schedule_id
    user = request.user
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        comment = Comment.objects.create(text=payload.text, schedule=schedule,user=user)
        comment.save()
        return {"success" : True}
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 해당 일정에 작성된 코멘트 불러오기
@router.get("/schedules/{schedule_id}/comments/", tags=["코멘트"])
def get_comments_for_schedule(request, schedule_id: int):
    try:
        comments = Comment.objects.filter(schedule_id=schedule_id)  # 해당 스케줄에 해당하는 comment 검색
        comment_list = [
            CommentOut(
                id=comment.id,
                username=comment.user.first_name,
                timestamp=comment.timestamp,
                text=comment.text,
                schedule_id=comment.schedule_id,
            )
            for comment in comments
        ]
        return comment_list
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 댓글 수정
@router.put("/comments/{comment_id}", tags=["코멘트"])
def update_comment(request, comment_id: int, payload: CommentIn):
    try:
        comment = Comment.objects.get(id=comment_id)
        comment.text = payload.text
        comment.save()

        return CommentOut(
            id=comment.id,
            user_id=comment.user.id,
            timestamp=comment.timestamp,
            text=comment.text,
            schedule_id=comment.schedule_id,
        )
    except Comment.DoesNotExist:
        return 404, {"error": "Comment not found"}

# 댓글 삭제
@router.delete("/comments/{comment_id}", tags=["코멘트"])
def delete_comment(request, comment_id: int):
    try:
        comment = Comment.objects.get(id=comment_id)
        comment.delete()
        return {"success" : True}
    except Comment.DoesNotExist:
        return 404, {"error": "Comment not found"}

#####################################################################

# 스케줄 생성
@router.post("/schedules/", tags=["스케줄"])
def create_schedule(request,payload:ScheduleIn):
    schedule = Schedule.objects.create(
        start_date = payload.start_date,
        end_date = payload.start_date,
        schedule = payload.schedule,
        is_holiday = payload.is_holiday,
    )
    schedule.save()
    return{"success": True}

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
        )
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 내일까지 엔드데이트랑 스타트데이트
@router.get("/schedules/", response=List[ScheduleOut], tags=["스케줄"])
def get_schedules_in_date_range(request, start_date: date, end_date: date):
    # start_date와 end_date 사이의 스케줄을 데이터베이스에서 조회
    schedules = Schedule.objects.filter(start_date__gte=start_date, end_date__lte=end_date)
    
    # 조회된 스케줄을 ScheduleOut 형태로 변환하여 응답
    schedule_list = []
    for schedule in schedules:
        schedule_data = {
            "id": schedule.id,
            "start_date": schedule.start_date,
            "end_date": schedule.end_date,
            "schedule": schedule.schedule,
            "is_holiday": schedule.is_holiday,
        }
        schedule_list.append(ScheduleOut(**schedule_data))
    
    return schedule_list

# 특정 스케줄 수정
@router.put("/schedules/{schedule_id}/", tags=["스케줄"], response=ScheduleOut)
def update_schedule(request, schedule_id: int, payload: ScheduleIn):
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        schedule.start_date = payload.start_date
        schedule.end_date = payload.start_date
        schedule.schedule = payload.schedule
        schedule.is_holiday = payload.is_holiday
        schedule.save()

        return ScheduleOut(
            id=schedule.id,
            start_date=schedule.start_date,
            end_date=schedule.end_date,
            schedule=schedule.schedule,
            is_holiday=schedule.is_holiday,
        )
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 특정 스케줄 삭제
@router.delete("/schedules/{schedule_id}/", tags=["스케줄"])
def delete_schedule(request, schedule_id: int):
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        schedule.delete()  # 스케줄 삭제

        return {"success": True}
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}