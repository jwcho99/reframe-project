from django.db import models
# Django의 기본 사용자 모델을 가져오기 위해 추가합니다.
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    """
    게시글 모델
    """
    # 제목: 최대 200자까지 저장 가능한 문자열 필드
    title = models.CharField(max_length=200)
    
    # 내용: 길이 제한이 없는 긴 텍스트 필드
    content = models.TextField()
    
    # 작성일: auto_now_add=True는 데이터가 처음 생성될 때의 날짜/시간을 자동으로 저장합니다.
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 수정일: auto_now=True는 데이터가 저장될 때마다(수정될 때마다) 날짜/시간을 자동으로 갱신합니다.
    updated_at = models.DateTimeField(auto_now=True)

    # 작성자: User 모델과 '다대일(N:1)' 관계를 설정합니다.
    # on_delete=models.CASCADE는 연결된 User가 삭제될 때, 해당 User가 쓴 게시글도 함께 삭제된다는 의미입니다.
    # author 필드에 null=True, blank=True를 추가하여 비워둘 수 있도록 허용합니다.
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        # 나중에 Django 관리자 페이지에서 게시글 제목으로 보이게 해줍니다.
        return self.title


class Comment(models.Model):
    """
    댓글 모델
    """
    # 댓글 내용
    content = models.TextField()

    # 작성일
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 수정일
    updated_at = models.DateTimeField(auto_now=True)

    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return f'{self.author} :: {self.content}'


class AdminFile(models.Model):
    """
    관리자 전용 파일 업로드 모델
    """
    description = models.CharField(max_length=255, blank=True)
    # upload_to는 파일이 저장될 media 폴더 하위 경로
    file = models.FileField(upload_to='admin_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        # 파일명만 반환하도록 수정 (os.path.basename 사용)
        return os.path.basename(self.file.name)