from ninja import NinjaAPI, Schema
from .models import User,StudyTimer
from datetime import date
from django.shortcuts import get_object_or_404
from accounts.api import router as accounts_router
from schedule.api import router as schedule_router

api  = NinjaAPI()


api.add_router("/accounts/", accounts_router)
api.add_router("/schedule/", schedule_router)   

class TimerIn(Schema):
    user_id: int
    username: str
    studyTime: str
    date: date


@api.post('/timer')
def create_Timer(request, payload: TimerIn):
    user = User.objects.get(id=payload.user_id)
    time = StudyTimer.objects.create(user=user, studyTime=payload.studyTime)
    return {"id":user.id, "studyTime": time.studyTime}

@api.put('/timer/{user_id}')
def update_Timer(request, user_id: int, payload: TimerIn):
    time = get_object_or_404(StudyTimer, id=user_id)
    time.studyTime = payload.studyTime
    time.save()
    return {"studyTime": time.studyTime}