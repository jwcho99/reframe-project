import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack } from '@mui/material'; // MUI 컴포넌트 import


function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.post('/community/posts/', { title, content });
      navigate('/community');
    } catch (error) {
      console.error('글을 생성하는 데 실패했습니다.', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}> {/* 위쪽 여백 추가 */}
      <PageTitle title="📝 새 글 작성하기" />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}> {/* 컴포넌트 간 간격 추가 */}
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