import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute() {
  // user와 token 대신, user와 loading 상태를 가져옵니다.
  const { user, loading } = useContext(AuthContext);

  // 1. 사용자 정보를 확인하는 중(loading)이면, 잠시 "로딩 중..." 메시지를 보여줍니다.
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 2. 로딩이 끝났는데도 user 정보가 없으면(로그인되지 않았으면), 로그인 페이지로 보냅니다.
  if (!user) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" replace />;
  }

  // 3. 로딩이 끝났고 user 정보가 있으면, 요청한 페이지를 보여줍니다.
  return <Outlet />;
}

export default ProtectedRoute;