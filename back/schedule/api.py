from ninja import Schema, Router, Path, Query
from potato.models import Comment, User, Schedule
from django.shortcuts import get_object_or_404
from django.http import HttpResponseServerError
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
    user_id: int
    timestamp: date
    text: str

class ScheduleIn(Schema):
    start_date: date
    end_date: date
    schedule: str
    is_holiday: bool

class ScheduleOut(ScheduleIn):
    id: int

#댓글작성
@router.post("/comments")
def create_Comment(request, payload: CommentIn):
    schedule_id = payload.schedule_id
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        user_id = 2
        comment = Comment.objects.create(text=payload.text, schedule=schedule,user_id=user_id)
        return {"success" : True}
    except Schedule.DoesNotExist:
        return 404, {"error": "Schedule not found"}

# 해당 일정에 작성된 코멘트 불러오기 (미완)
@router.get('/comments/{comment_id}', response=CommentOut)
def get_Comment(request, comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    return comment

# @router.get("/comments/")
# def get_all_comments(request):
#     comments = Comment.objects.all()
#     comment_data = [{"id": comment.id, "text": comment.text, "timestamp": comment.timestamp} for comment in comments]
#     return comment_data

@router.put("/comments/{comment_id}")
def update_Comment(request,comment_id: int, payload: CommentIn):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.user_id = payload.user_id
    comment.timestamp = payload.timestamp
    comment.text = payload.text
    comment.save()
    return {"success" : True}

# 코멘트 삭제
@router.delete("/comments/{comment_id}")
def delete_Comment(request,comment_id: int):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return {"success" : True}

# # 스케줄 생성
# @router.post("/schedules/", response_model=ScheduleOut)
# def create_schedule(schedule: ScheduleIn):
#     db_schedule = Schedule(**schedule.dict())
#     db_schedule.save()
#     return db_schedule

# # 모든 스케줄 조회
# @router.get("/schedules/", response_model=List[ScheduleOut])
# def get_all_schedules():
#     schedules = Schedule.objects.all()
#     return list(schedules)

# # 특정 스케줄 조회
# @router.get("/schedules/{schedule_id}/", response_model=ScheduleOut)
# def get_schedule(schedule_id: int = Path(..., title="Schedule ID")):
#     try:
#         schedule = Schedule.objects.get(id=schedule_id)
#         return schedule
#     except Schedule.DoesNotExist:
#         return {"Schedule not found"}

# # 특정 스케줄 수정
# @router.put("/schedules/{schedule_id}/", response_model=ScheduleOut)
# def update_schedule( schedule: ScheduleIn,schedule_id: int = Path(..., title="Schedule ID")):
#     try:
#         db_schedule = Schedule.objects.get(id=schedule_id)
#         for attr, value in schedule.dict().items():
#             setattr(db_schedule, attr, value)
#         db_schedule.save()
#         return db_schedule
#     except Schedule.DoesNotExist:
#         return {"Schedule not found"}

# # 특정 스케줄 삭제
# @router.delete("/schedules/{schedule_id}/", response_model=ScheduleOut)
# def delete_schedule(schedule_id: int = Path(..., title="Schedule ID")):
#     try:
#         schedule = Schedule.objects.get(id=schedule_id)
#         schedule.delete()
#         return schedule
#     except Schedule.DoesNotExist:
#         return {"Schedule not found"}