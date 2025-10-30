from rest_framework import serializers
from .models import Post, Comment, AdminFile
from django.contrib.auth.models import User
# dj_rest_auth의 기본 Serializer를 불러옵니다.
from dj_rest_auth.serializers import UserDetailsSerializer


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True, allow_null=True, required=False)
    # 작성자 표시용 필드 추가
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        # fields에 nickname과 display_name 추가
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'post', 'author_username', 'nickname', 'display_name']
        read_only_fields = ['author', 'post']

    # display_name 필드의 값을 계산하는 함수
    def get_display_name(self, obj):
        if obj.author:
            return obj.author.username
        return obj.nickname if obj.nickname else '익명' # 닉네임 없으면 '익명'


class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True, allow_null=True, required=False)
    # 작성자 표시용 필드 추가
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        # fields에 nickname과 display_name 추가
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author', 'comments', 'author_username', 'nickname', 'display_name']
        read_only_fields = ['author']

    # display_name 필드의 값을 계산하는 함수
    def get_display_name(self, obj):
        if obj.author:
            return obj.author.username
        return obj.nickname if obj.nickname else '익명'

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