# Generated by Django 3.2.13 on 2023-09-21 02:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('potato', '0003_user_imgfile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='imgfile',
        ),
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(null=True, upload_to='profile_images/'),
        ),
    ]
