from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    객체의 소유자에게만 쓰기를 허용하는 커스텀 권한.
    """
    def has_object_permission(self, request, view, obj):
        # 읽기 요청(GET, HEAD, OPTIONS)은 누구나 허용합니다.
        if request.method in permissions.SAFE_METHODS:
            return True

        # 쓰기 요청(POST, PUT, DELETE)은 객체(obj)의 작성자(author)와
        # 요청을 보낸 사용자(request.user)가 동일할 때만 허용합니다.
        return obj.author == request.user