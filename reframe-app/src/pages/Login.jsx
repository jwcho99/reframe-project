import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.jwcho.cloud/api/auth/login/', formData);
      login(response.data.access);
      alert("로그인에 성공했습니다!");
      navigate('/');
    } catch (error) {
      console.error('로그인에 실패했습니다.', error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '400px', mx: 'auto' }}> {/* 가운데 정렬 및 최대 너비 설정 */}
      <PageTitle title="로그인" />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="사용자 이름"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" size="large">
            로그인
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default Login;