from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.conf import settings
import os
import replicate
import base64

from .models import Post, Comment, AdminFile
from .serializers import PostSerializer, CommentSerializer, AdminFileSerializer
from .permissions import IsOwnerOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at') # 최신순 정렬 추가
    serializer_class = PostSerializer
    permission_classes = [AllowAny] # AllowAny로 변경

    def perform_create(self, serializer):
        # 사용자가 인증되었을 경우(로그인 상태)에만 author를 저장
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save() # 익명 사용자는 author 없이 저장


class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk']).order_by('created_at') # 오래된 순 정렬

    serializer_class = CommentSerializer
    permission_classes = [AllowAny] # AllowAny로 변경

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_pk'])
        # 사용자가 인증되었을 경우에만 author를 저장
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user, post=post)
        else:
            serializer.save(post=post) # 익명 사용자는 post 정보만 저장

class PhotoRestoreAPIView(APIView):
    permission_classes = [IsAdminUser]
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

class AdminFileViewSet(viewsets.ModelViewSet):
    queryset = AdminFile.objects.all().order_by('-uploaded_at')
    serializer_class = AdminFileSerializer
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)