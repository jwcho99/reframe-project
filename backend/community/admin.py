from django.contrib import admin
from .models import Post, Comment # 방금 우리가 models.py에 만든 Post와 Comment를 불러옵니다.

# Register your models here.

# Post 모델을 관리자 페이지에 등록합니다.
admin.site.register(Post)

# Comment 모델을 관리자 페이지에 등록합니다.
admin.site.register(Comment)