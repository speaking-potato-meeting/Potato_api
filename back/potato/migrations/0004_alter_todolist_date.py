# Generated by Django 3.2.13 on 2023-09-20 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('potato', '0003_remove_user_individual_rule'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
