from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.conf import settings
import os
import replicate
import base64

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsOwnerOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk'])

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_pk'])
        serializer.save(author=self.request.user, post=post)


class PhotoRestoreAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "이미지 파일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # --- 이 부분이 수정되었습니다 ---
            # settings.py의 토큰을 사용하여 Replicate 클라이언트를 직접 생성하고 인증합니다.
            # 이것이 가장 확실하고 안정적인 방법입니다.
            client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)

            image_data = image_file.read()
            base64_data = base64.b64encode(image_data).decode('utf-8')
            data_uri = f"data:{image_file.content_type};base64,{base64_data}"
            
            # client.run() 메소드를 사용합니다.
            output = client.run(
                "sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
                input={
                    "image": data_uri,
                    # 이 줄을 추가해주세요! 0.7은 따옴표 없는 숫자입니다.
                    "codeformer_fidelity": 0.7 
                }
            )

            restored_url = str(output)
            # --- 여기까지 ---
            
            return Response({"restored_image_url": restored_url}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes에 IsOwnerOrReadOnly를 추가합니다.
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk'])

    serializer_class = CommentSerializer
    # permission_classes에 IsOwnerOrReadOnly를 추가합니다.
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_pk'])
        serializer.save(author=self.request.user, post=post)