import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import PhotoRestorer from './pages/PhotoRestorer.jsx';
import RoadmapGenerator from './pages/RoadmapGenerator.jsx';
import Community from './pages/Community.jsx';
import NewPost from './pages/NewPost.jsx';
import PostDetail from './pages/PostDetail.jsx'; // 상세 페이지 컴포넌트 불러오기
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import EditPost from './pages/EditPost.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // AuthProvider 불러오기

// 라우터 설정: 어떤 경로(path)에 어떤 컴포넌트(element)를 보여줄지 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/community', element: <Community /> },
      { path: '/community/new', element: <NewPost /> },
      // ':postId'는 "이 위치에 어떤 값이든 올 수 있다"는 의미의 동적 파라미터입니다.
      { path: '/signup', element: <Signup /> }, // 회원가입 경로 추가
      { path: '/login', element: <Login /> },   // 로그인 경로 추가
      { path: '/community/:postId', element: <PostDetail /> }, // <-- 상세 페이지 경로 추가
      { path: '/community/:postId/edit', element: <EditPost /> },
      { path: '/photo', element: <PhotoRestorer /> },
      { path: '/roadmap', element: <RoadmapGenerator /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);