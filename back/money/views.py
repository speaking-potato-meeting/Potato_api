from django.shortcuts import render
from potato.models import User

def test():
    print(0)
    user = User.objects.get(id=27)
    user.total_fee=5
    user.save()
    print(1)


#자동실행 가능함
#터미널에서 확인 모델 수정 가능
#if 월요일 모델 수정 확인