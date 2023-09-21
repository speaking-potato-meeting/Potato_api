from django.contrib import admin
from .models import Comment,User,Timer
# Register your models here.
admin.site.register(Comment)
admin.site.register(User)
admin.site.register(Timer)