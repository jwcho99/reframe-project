import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      // dj-rest-auth의 회원가입 필드 이름에 맞게 수정 (password -> password1)
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const signupData = {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.password2,
      };
      await axios.post(`${baseURL}auth/registration/`, signupData);
      alert("회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate('/login');
    } catch (error) {
      console.error('회원가입에 실패했습니다.', error.response.data);
      alert("회원가입에 실패했습니다. (콘솔을 확인하세요)");
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '400px', mx: 'auto' }}>
      <PageTitle title="회원가입" />
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
            label="이메일 주소"
            name="email"
            type="email"
            value={formData.email}
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
          <TextField
            label="비밀번호 확인"
            name="password2"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" size="large">
            가입하기
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default Signup;