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

# 벌금 작성 (새로 만든 규칙 요청 - 승인 전)
@router.post("/moneys", tags=["벌금"])
@login_required
def create_Money(request, payload: MoneyIn):
    user = request.user
    money = Money.objects.create(individual_rule_content=payload.individual_rule_content, user=user, money=payload.fee)
    money.save()
    return {"success" : True}

# 회원별 벌금 조회
@router.get("/moneys/{user_id}", tags=["벌금"])
def get_moneys(request, user_id: int):
    moneys = Money.objects.filter(user_id=user_id)
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

# 벌금 삭제 (원래 있던 규칙 {교체or삭제} 요청 - 승인, 새로 만든 규칙 요청 - 거부)
@router.delete("/moneys/{money_id}", tags=["벌금"])
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

# 벌금 is_active 값 수정 (벌금을 내면 0 안내면 1)
@router.put("/moneys/{money_id}/confirm_2", tags=["벌금"])
def update_is_active(request, money_id: int):
    try:
        money = Money.objects.get(id=money_id)
        money.is_active = 0
        money.save()
        return {"message": "벌금 confirm 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    
# 벌금 is_active 값 초기화
@router.put("/moneys/", tags=["벌금"])
def reset_is_active(request):
    moneys = Money.objects.all()
    for money in moneys:
        money.is_active = 1
        money.save()
    return {"message": "벌금 is_active 값 초기화 완료"}