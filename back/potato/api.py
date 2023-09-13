from ninja import NinjaAPI
from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
# from .models import Comment

api  = NinjaAPI()

@api.get("/hello")
def hello(request):
    return {'test': "success"}