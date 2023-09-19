from django.db import models
from django.contrib.auth.models import AbstractUser
# , Group, Permission
# Create your models here.


class User(AbstractUser):
    MBTI_CHOICES = (
        ('ISTJ', 'ISTJ'),
        ('ISFJ', 'ISFJ'),
        ('INFJ', 'INFJ'),
        ('INTJ', 'INTJ'),
        ('ISTP', 'ISTP'),
        ('ISFP', 'ISFP'),
        ('INFP', 'INFP'),
        ('INTP', 'INTP'),
        ('ESTP', 'ESTP'),
        ('ESFP', 'ESFP'),
        ('ENFP', 'ENFP'),
        ('ENTP', 'ENTP'),
        ('ESTJ', 'ESTJ'),
        ('ESFJ', 'ESFJ'),
        ('ENFJ', 'ENFJ'),
        ('ENTJ', 'ENTJ'),
    )
    username = models.CharField(max_length=20,unique=True)
    #unique=True 중복x
    password = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    github = models.URLField()
    blog = models.URLField(blank=True)
    MBTI = models.CharField(max_length=4, choices=MBTI_CHOICES, default='')
    position = models.CharField(max_length=20)
    cdt = models.DateTimeField(auto_now_add=True)
    individual_rule = models.TextField(null=True, blank=True)
    #변경
    birth = models.DateField()
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)


class Rule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    all_rule = models.TextField(null=True, blank=True)
    #변경
    time = models.IntegerField(default=30)


class TodoList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    date = models.DateTimeField()
    description = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)


class Money(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    money = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)


# Study 보충필요
class Study(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    study = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)


class Schedule(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    schedule = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField(null=True, blank=True)
    


