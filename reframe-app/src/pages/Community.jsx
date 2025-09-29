import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. axios 불러오기
import PageTitle from '../components/PageTitle';
import axiosInstance from '../api/axiosInstance';
import Button from '@mui/material/Button';

function Community() {
  // 2. 게시글 데이터를 저장할 state 생성
  // 초기값은 빈 배열 [] 입니다.
  const [posts, setPosts] = useState([]);

  // 3. 백엔드에서 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      // Django 서버의 게시글 목록 API에 GET 요청을 보냅니다.
      const response = await axiosInstance.get('community/posts/');
      // 성공적으로 데이터를 받아오면, setPosts를 이용해 posts state를 업데이트합니다.
      setPosts(response.data);
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다.", error);
    }
  };

  // 4. useEffect: 이 컴포넌트가 처음 화면에 렌더링될 때 딱 한 번만 실행됩니다.
  useEffect(() => {
    fetchPosts(); // 데이터를 가져오는 함수 호출
  }, []); // [] (빈 배열)은 "최초 1회만 실행"하라는 의미입니다.

  return (
    <div>
      <PageTitle title="📢 커뮤니티" />
      <Link to="/community/new"> {/* 글쓰기 페이지로 가는 링크 추가 */}
        <Button variant="contained">새 글 작성하기</Button>
      </Link>
      <div className="post-list">
        {/* 5. posts state에 저장된 데이터를 화면에 그리기 */}
        {posts.map(post => (
        <div key={post.id} className="post-item">
          {/* post.id를 사용해 각 게시글의 고유한 경로를 만들어줍니다. */}
          <Link to={`/community/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.content}</p>
          <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
        </div>
      ))}
        
      </div>
    </div>
  );
}

export default Community;