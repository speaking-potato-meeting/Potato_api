from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date
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
    password = models.CharField(max_length=200)
    birth = models.DateField(blank=False)
    phone = models.CharField(max_length=20,blank=False)
    address = models.CharField(max_length=50,blank=False)
    github = models.URLField(blank=False)
    blog = models.URLField(blank=True)
    MBTI = models.CharField(max_length=4, choices=MBTI_CHOICES, default='',blank=False)
    position = models.CharField(max_length=20,blank=False)
    cdt = models.DateTimeField(auto_now_add=True)
    total_fee = models.IntegerField(default=0)
    week_studytime = models.IntegerField(default=0)
    penalty = models.IntegerField(default=0)
    immunity = models.IntegerField(default=0)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_studying = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/')


class Rule(models.Model):
    all_rule = models.TextField(null=True, blank=True)
    time = models.IntegerField(default=30)


class TodoList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)


class Money(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    money = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    individual_rule_content = models.TextField(default="개인 벌금 규칙 내용입니다.")
    confirm = models.IntegerField(default=1)


class StudyTimer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    study = models.IntegerField(default=0)


class Schedule(models.Model):
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True, blank=True)
    schedule = models.CharField(max_length=100)
    is_holiday = models.BooleanField(default=False)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField(null=True, blank=True)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)