from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    # author의 username을 가져오기 위한 필드를 추가합니다.
    # source='author.username'은 author 필드의 username 속성을 가리킵니다.
    # read_only=True는 이 필드가 읽기 전용임을 의미합니다.
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        # fields에 'author_username'을 추가합니다.
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'post', 'author_username']
        read_only_fields = ['author', 'post']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['author'] # author는 자동으로 채워질 것이므로 읽기 전용으로 설정