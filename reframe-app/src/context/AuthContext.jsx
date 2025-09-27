import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Context 생성: 앱 전체에 공유할 저장 공간 만들기
export const AuthContext = createContext(null);

// 2. AuthProvider 컴포넌트 생성: 저장소를 관리하고, 정보를 제공하는 역할
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보 저장
  const [token, setToken] = useState(localStorage.getItem('accessToken')); // 토큰 저장

  useEffect(() => {
    // 앱이 처음 시작될 때 토큰이 있으면 사용자 정보를 가져옵니다.
    const fetchUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // dj-rest-auth가 제공하는 /user/ 엔드포인트로 사용자 정보 요청
          const response = await axios.get('http://127.0.0.1:8000/api/auth/user/');
          setUser(response.data);
        } catch (error) {
          console.error("사용자 정보 로딩 실패", error);
          // 토큰이 유효하지 않으면 토큰과 사용자 정보 삭제
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [token]);

  // 로그인 처리 함수
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  // 로그아웃 처리 함수
  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // 3. 자식 컴포넌트들에게 공유할 값들을 value에 담아 전달
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};