import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack } from '@mui/material'; // MUI 컴포넌트 import
import { AuthContext } from '../context/AuthContext';


function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 로그인 상태 가져오기
  const [nickname, setNickname] = useState('');

  // console.log('NewPost user state:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    /* const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    } */
    const postData = { title, content, nickname: user ? null : nickname }; // 로그인 시 null
    const apiEndpoint = '/community/posts/';


    try {
      // --- 이 부분을 수정합니다 ---
      if (user) {
        // 로그인 상태: axiosInstance 사용 (자동으로 토큰 첨부)
        await axiosInstance.post(apiEndpoint, postData);
      } else {
        // 로그아웃 상태: 순수 axios 사용
        // baseURL을 환경 변수에서 가져와 조합합니다.
        //console.log('Submitting post while logged out:', postData);
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        await axios.post(`${baseURL}${apiEndpoint}`, postData);
      }

      navigate('/community');
    } catch (error) {
      console.error('글을 생성하는 데 실패했습니다.', error);
      alert('글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ mt: 4 }}> {/* 위쪽 여백 추가 */}
      <PageTitle title="📝 새 글 작성하기" />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}> {/* 컴포넌트 간 간격 추가 */}
          {!user && (
            <TextField
              label="닉네임 (선택 사항, 기본값: 익명)"
              variant="outlined"
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          )}
          <TextField
            label="제목"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="내용"
            variant="outlined"
            fullWidth
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large">
            제출하기
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default NewPost;