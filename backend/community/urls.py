from django.urls import path, include
# DefaultRouter 대신 NestedSimpleRouter를 사용합니다.
from rest_framework_nested import routers
from .views import PostViewSet, CommentViewSet, PhotoRestoreAPIView, AdminFileViewSet

# 1단계: 기본 라우터 생성
# 이 라우터는 /posts/ 주소를 담당합니다.
router = routers.SimpleRouter()
router.register('posts', PostViewSet)
router.register('admin-files', AdminFileViewSet)

# 2단계: 중첩 라우터 생성
# 이 라우터는 /posts/{post_pk}/comments/ 주소를 담당합니다.
# 'posts'는 부모 라우터의 이름, 'post_pk'는 부모 리소스의 ID를 의미하는 변수입니다.
comments_router = routers.NestedSimpleRouter(router, 'posts', lookup='post')
comments_router.register('comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    # 두 라우터가 만들어준 모든 URL을 메뉴판에 포함시킵니다.
    path('', include(router.urls)),
    path('', include(comments_router.urls)),
    path('restore-photo/', PhotoRestoreAPIView.as_view(), name='photo-restore'),
]