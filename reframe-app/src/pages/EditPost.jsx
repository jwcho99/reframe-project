import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack } from '@mui/material';

function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/community/posts/${postId}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error("게시글 정보를 불러오는 데 실패했습니다.", error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/community/posts/${postId}/`, { title, content });
      alert("게시글이 성공적으로 수정되었습니다.");
      navigate(`/community/${postId}`);
    } catch (error) {
      console.error("게시글 수정에 실패했습니다.", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <PageTitle title="📝 게시글 수정하기" />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
            수정 완료
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditPost;