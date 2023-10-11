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
@router.post("/common-moneys", tags=["벌금"])
def create_common_money(request, payload: CommonMoneyIn):
    # payload에서 공통 rule_content 및 fee를 가져옵니다.

    # 모든 사용자에게 적용되는 벌금 레코드 생성
    users = User.objects.all()
    for user in users:
        day_money = Money.objects.create(user=user, money=payload.day_fee, individual_rule_content="하루공부", confirm=payload.day_study_time)
        day_money.save()
        week_money = Money.objects.create(user=user, money=payload.week_fee, individual_rule_content="일주일공부", confirm=payload.week_study_time)
        week_money.save()

    return {"success": True}

# 개인별로 하루공부, 일주일공부 수정
@router.put("/common-moneys/{rule_content}", tags=["벌금"])
@login_required
def Update_Common_Money(request, rule_content: str, studytime: int, fee: int ):
    user = request.user
    try:
        if rule_content == "하루공부":
            money = Money.objects.get(user=user,individual_rule_content=rule_content)
            money.confirm = studytime
            money.money = fee
            money.save()
            return {"message": "하루공부 필드 업데이트 성공"}
        elif rule_content == "일주일공부":
            money = Money.objects.get(user=user,individual_rule_content=rule_content)
            money.confirm = studytime
            money.money = fee
            money.save()
            return {"message": "일주일공부 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}

# 회원별 벌금 조회
@router.get("/moneys/{user_id}", tags=["벌금"])
def user_get_moneys(request, user_id: int):
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

# 전체 회원 벌금 조회
@router.get("/moneys", tags=["벌금"])
def get_moneys(request):
    moneys = Money.objects.exclude(individual_rule_content="하루공부").exclude(individual_rule_content="일주일공부")
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
        money = Money.objects.get(id=money_id)
        money.is_active = False
        money.save()
        return {"message": "벌금 confirm 필드 업데이트 성공"}
    except Money.DoesNotExist:
        return {"message": "벌금 정보가 없음."}
    
# 벌금 is_active 값 초기화
@router.put("/moneys/", tags=["벌금"])
def reset_is_active(request):
    moneys = Money.objects.all()
    for money in moneys:
        money.is_active = True
        money.save()
    return {"message": "벌금 is_active 값 초기화 완료"}