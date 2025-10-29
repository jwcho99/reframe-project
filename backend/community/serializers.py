from rest_framework import serializers
from .models import Post, Comment, AdminFile
from django.contrib.auth.models import User
# dj_rest_auth의 기본 Serializer를 불러옵니다.
from dj_rest_auth.serializers import UserDetailsSerializer


class CommentSerializer(serializers.ModelSerializer):
    # author의 username을 가져오기 위한 필드를 추가합니다.
    # source='author.username'은 author 필드의 username 속성을 가리킵니다.
    # read_only=True는 이 필드가 읽기 전용임을 의미합니다.
    author_username = serializers.CharField(source='author.username', read_only=True, allow_null=True, required=False)

    class Meta:
        model = Comment
        # fields에 'author_username'을 추가합니다.
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'post', 'author_username']
        read_only_fields = ['author', 'post']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    # Post에도 author_username 추가 및 수정
    author_username = serializers.CharField(source='author.username', read_only=True, allow_null=True, required=False)

    class Meta:
        model = Post
        # fields에 author_username 추가
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author', 'comments', 'author_username']
        read_only_fields = ['author']


class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta(UserDetailsSerializer.Meta):
        # 기존 필드에 is_staff와 is_superuser를 추가합니다.
        fields = UserDetailsSerializer.Meta.fields + ('is_staff', 'is_superuser')
        read_only_fields = ('email',) # email은 읽기 전용으로 유지 (선택 사항)


class AdminFileSerializer(serializers.ModelSerializer):
    # 업로드한 관리자의 username을 함께 보여주기 위함
    uploader_username = serializers.CharField(source='uploader.username', read_only=True, allow_null=True, required=False)

    class Meta:
        model = AdminFile
        # API를 통해 보여줄 필드 목록 (file 필드는 파일 URL을 보여줌)
        fields = ['id', 'description', 'file', 'uploaded_at', 'uploader', 'uploader_username']
        # uploader 필드는 perform_create에서 자동으로 채워지므로 읽기 전용
        read_only_fields = ['uploader']