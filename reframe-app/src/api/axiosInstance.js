import axios from 'axios';

// 새로운 axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Vercel 변수를 읽어옴
});

// 요청 인터셉터(interceptor) 추가
// 모든 요청이 보내지기 전에 이 코드가 먼저 실행됩니다.
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken을 가져옵니다.
    const token = localStorage.getItem('accessToken');
    // 토큰이 존재하면, 헤더에 Authorization을 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;