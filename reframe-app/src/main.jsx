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
// import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import EditPost from './pages/EditPost.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // ProtectedRoute 컴포넌트 불러오기
import { AuthProvider } from './context/AuthContext.jsx'; // AuthProvider 불러오기
import AdminFiles from './pages/AdminFiles.jsx'; // 관리자 파일 관리 페이지 불러오기

// 라우터 설정: 어떤 경로(path)에 어떤 컴포넌트(element)를 보여줄지 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // 누구나 접근 가능한 페이지들
      { path: '/', element: <Home /> },
      //{ path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/community', element: <Community /> },
      { path: '/community/:postId', element: <PostDetail /> },
      { path: '/roadmap', element: <RoadmapGenerator /> },
      { path: '/community/new', element: <NewPost /> },

      // --- 로그인이 필요한 페이지들을 ProtectedRoute로 감싸줍니다 ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/community/:postId/edit', element: <EditPost /> },
          { path: '/photo', element: <PhotoRestorer /> },
          { path: '/admin/files', element: <AdminFiles /> }, // <-- 관리자 파일 경로 추가
        ]
      }
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