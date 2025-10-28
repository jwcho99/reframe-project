import React, { useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. axios 불러오기
import PageTitle from '../components/PageTitle';
import axiosInstance from '../api/axiosInstance';
import { Button, Box, Paper, Typography } from '@mui/material'; // MUI 컴포넌트 추가
import { AuthContext } from '../context/AuthContext';

function Community() {
  // 2. 게시글 데이터를 저장할 state 생성
  // 초기값은 빈 배열 [] 입니다.
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext); // 로그인 상태 가져오기 

  // console.log('현재 로그인된 사용자 정보:', user);

  // 3. 백엔드에서 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      // Django 서버의 게시글 목록 API에 GET 요청을 보냅니다.
      const response = await axiosInstance.get('community/posts/');
      // 성공적으로 데이터를 받아오면, setPosts를 이용해 posts state를 업데이트합니다.
      // console.log('로컬 API 응답:', response.data); // 확인용 로그
      setPosts(response.data || []); // 혹시 results가 없을 경우를 대비해 빈 배열([]) 사용
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다.", error);
      setPosts([]); // 에러 발생 시 빈 배열로 설정
    }
  };

  // 4. useEffect: 이 컴포넌트가 처음 화면에 렌더링될 때 딱 한 번만 실행됩니다.
  useEffect(() => {
    fetchPosts(); // 데이터를 가져오는 함수 호출
  }, []); // [] (빈 배열)은 "최초 1회만 실행"하라는 의미입니다.

  const handlePostDelete = async (postId) => {
        if (window.confirm("정말 이 게시글을 삭제하시겠습니까? (관리자 권한)")) {
            try {
                await axiosInstance.delete(`/community/posts/${postId}/`);
                alert("게시글이 삭제되었습니다.");
                fetchPosts(); // 목록 새로고침
            } catch (error) {
                console.error("게시글 삭제에 실패했습니다.", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

  return (
        <Box>
            <PageTitle title="📢 커뮤니티" />
            <Button component={Link} to="/community/new" variant="contained" sx={{ mb: 2 }}>
                새 글 작성하기
            </Button>
            <div className="post-list">
                {Array.isArray(posts) && posts.map(post => (
                    <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" component={Link} to={`/community/${post.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                    {post.title}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    작성자: {post.author_username || '익명'} | 작성일: {new Date(post.created_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                            {/* --- 관리자 전용 삭제 버튼 추가 --- */}
                            {user && (user.is_staff || user.is_superuser) && ( // is_staff 또는 is_superuser 확인
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handlePostDelete(post.id)}>
                                    삭제 (Admin)
                                </Button>
                            )}
                            {/* --- 여기까지 --- */}
                        </Box>
                    </Paper>
                ))}
                {!Array.isArray(posts) && posts && <p>데이터 형식이 올바르지 않습니다.</p>}
            </div>
        </Box>
    );
}

export default Community;