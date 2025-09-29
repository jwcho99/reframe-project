import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance'; // 순수 axios 대신 import

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  // --- 로딩 상태를 추가합니다. 처음에는 true (로딩 중) ---
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axiosInstance.get('auth/user/');
          setUser(response.data);
        } catch (error) {
          console.error("사용자 정보 로딩 실패", error);
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      // --- 사용자 정보 확인 작업이 끝나면 로딩 상태를 false로 변경 ---
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // --- 자식 컴포넌트에게 loading 상태도 함께 공유 ---
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};