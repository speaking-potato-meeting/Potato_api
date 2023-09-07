from ninja import NinjaAPI, Schema, Router
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt

api = NinjaAPI()
router = Router()

@router.post('/sign', response=User)
def sign_up or_in()