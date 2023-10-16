from ninja import Schema, Router, Path, Query
from potato.models import Money, User
from django.contrib.auth.decorators import login_required
import logging
from django.contrib.auth.decorators import user_passes_test#슈퍼유저만

router = Router()
logger = logging.getLogger(__name__)

class MoneyIn(Schema):
    fee: int
    individual_rule_content : str

class MoneyOut(Schema):
    username: str
    fee: int
    individual_rule_content : str

class CommonMoneyIn(Schema):
    day_fee: int
    day_study_time : int
    week_fee: int
    week_study_time : int

# 벌금 작성 (새로 만든 규칙 요청 - 승인 전)
@router.post("/moneys", tags=["벌금"])
@login_required
def create_Money(request, payload: MoneyIn):
    user = request.user
    money = Money.objects.create(individual_rule_content=payload.individual_rule_content, user=user, money=payload.fee)
    money.save()
    return {"success" : True}

# 전체 규칙 벌금 테이블에 적용
@router.post("/all-common-moneys", tags=["벌금"])
def create_common_money(request, payload: CommonMoneyIn):
    users = User.objects.all()
    for user in users:
        day_money = Money.objects.create(user=user,is_active=payload.day_study_time , money=payload.day_fee, individual_rule_content="+_+", confirm=0)
        day_money.save()
        week_money = Money.objects.create(user=user,is_active=payload.week_study_time, money=payload.week_fee, individual_rule_content="0_0", confirm=0)
        week_money.save()

    return {"success": True}

# 수정하려고 할때 원래 있던 데이터의 confirm 값 0으로 바꿔주기
@router.post("/common-moneys", tags=["벌금"])
@login_required
def create_or_update_common_money(request, payload: CommonMoneyIn):
    user = request.user
    try:
        day_money = Money.objects.get(user=user,individual_rule_content="+_+")    
        day_money.confirm = 2
        day_money.save()
        day_money = Money.objects.create(user=user,is_active=payload.day_study_time , money=payload.day_fee, individual_rule_content="+_+")
        day_money.save()
        week_money = Money.objects.get(user=user,individual_rule_content="0_0")    
        week_money.confirm = 2
        week_money.save()
        week_money = Money.objects.create(user=user,is_active=payload.week_study_time , money=payload.week_fee, individual_rule_content="0_0")
        week_money.save()
        return {"message": "시간벌금 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    
# 컨펌이 안되어있는 상태에서의 재수정
@router.put("/common-moneys", tags=["벌금"])
@login_required
def update_common_money_before_confirm(request, payload: CommonMoneyIn):
    user = request.user
    try:
        day_money = Money.objects.get(user=user,individual_rule_content="+_+",confirm=1)
        day_money.is_active = payload.day_study_time
        day_money.money = payload.day_fee
        day_money.save()
        week_money = Money.objects.get(user=user,individual_rule_content="0_0",confirm=1)
        week_money.is_active = payload.week_study_time
        week_money.money = payload.week_fee
        week_money.save()
        return {"message": "시간벌금 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}

# 전체 규칙 벌금 테이블 수정
@router.put("/all-common-moneys", tags=["벌금"])
def update_all_common_money(request, payload: CommonMoneyIn):
    users = User.objects.all()
    try:
        for user in users:
            day_money = Money.objects.get(user=user, individual_rule_content="+_+")
            day_money.money = payload.day_fee
            day_money.is_active = payload.day_study_time
            day_money.save()

            week_money = Money.objects.get(user=user, individual_rule_content="0_0")
            week_money.money = payload.week_fee
            week_money.is_active = payload.week_study_time
            week_money.save()
            
        return {"success": True}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}

# 회원별 벌금 조회
@router.get("/moneys/{user_id}", tags=["벌금"])
def user_get_moneys(request, user_id: int):
    try:
        moneys = Money.objects.filter(user_id=user_id).exclude(individual_rule_content="+_+").exclude(individual_rule_content="0_0")
        money_list = [
                MoneyOut(
                    id=money.id,
                    fee=money.money,
                    username=money.user.first_name,
                    individual_rule_content=money.individual_rule_content,
                )
                for money in moneys
        ]
        return money_list
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}


# 전체 회원 벌금 조회
@router.get("/moneys", tags=["벌금"])
def get_moneys(request):
    try:
        moneys = Money.objects.exclude(individual_rule_content="+_+").exclude(individual_rule_content="0_0")
        money_list = [
                MoneyOut(
                    id=money.id,
                    fee=money.money,
                    username=money.user.first_name,
                    individual_rule_content=money.individual_rule_content,
                )
                for money in moneys
        ]
        return money_list
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    

# 벌금 삭제 (원래 있던 규칙 {교체or삭제} 요청 - 승인, 새로 만든 규칙 요청 - 거부)
@router.delete("/moneys/", tags=["벌금"])
def delete_Money(request, money_id: int):
    try:
        money = Money.objects.get(id=money_id)
        money.delete()
        return {"message": "벌금 삭제 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    
    
# 벌금 confirm 값 수정 (원래 있던 규칙 {교체or삭제} 요청 - 거부, 새로 만든 규칙 요청 - 승인)
@router.put("/moneys/{money_id}/confirm_0", tags=["벌금"])
def update_Money_confirm_0(request, money_id: int):
    try:
        money = Money.objects.get(id=money_id)
        money.confirm = 0
        money.save()
        return {"message": "벌금 confirm 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    

# 벌금 confirm 값 수정 (원래 있던 규칙 {교체or삭제} 요청)
@router.put("/moneys/{money_id}/confirm_2", tags=["벌금"])
def update_Money_confirm_2(request, money_id: int):
    try:
        money = Money.objects.get(id=money_id)
        money.confirm = 2
        money.save()
        return {"message": "벌금 confirm 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    

# 벌금 is_active 값 수정 (규칙 수행한거 false 안한거 True)
@router.put("/moneys/{money_id}/is_active", tags=["벌금"])
def update_is_active(request, money_id: int):
    try:
        money = Money.objects.get(id=money_id).exclude(individual_rule_content="+_+").exclude(individual_rule_content="0_0")
        money.is_active = 0
        money.save()
        return {"message": "벌금 confirm 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    

# 벌금 is_active 값 초기화
@router.put("/moneys/", tags=["벌금"])
def reset_is_active(request):
    moneys = Money.objects.all().exclude(individual_rule_content="+_+").exclude(individual_rule_content="0_0")
    for money in moneys:
        money.is_active = 1
        money.save()
    return {"message": "벌금 is_active 값 초기화 완료"}