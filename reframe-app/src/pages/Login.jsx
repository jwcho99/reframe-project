import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { 
  TextField, Button, Box, Stack, Paper, Typography, 
  Avatar, Container, useTheme 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 순수 axios 사용 (인증 불필요 요청)
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const url = baseURL.endsWith('/') ? `${baseURL}auth/login/` : `${baseURL}/auth/login/`;
      const response = await axios.post(url, formData);
      
      login(response.data.access);
      // alert 대신 부드러운 이동 처리 (원한다면 스낵바 추가 가능)
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert("아이디와 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <PageTitle title="로그인" />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            width: '100%',
            borderRadius: 3 
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1, mb: 3 }}>
            관리자 로그인
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="username"
                label="사용자 이름"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
        
        {/* 하단 링크 (선택 사항) */}
        <Box sx={{ mt: 2 }}>
           <Typography variant="body2" color="text.secondary">
             홈으로 돌아가시겠습니까? <Link to="/" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 'bold' }}>홈으로 이동</Link>
           </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;



// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import PageTitle from '../components/PageTitle';
// import { TextField, Button, Box, Stack } from '@mui/material';

// function Login() {
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const baseURL = import.meta.env.VITE_API_BASE_URL;
//       const response = await axios.post(`${baseURL}/auth/login/`, formData);
//       login(response.data.access);
//       alert("로그인에 성공했습니다!");
//       navigate('/');
//     } catch (error) {
//       console.error('로그인에 실패했습니다.', error);
//       alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
//     }
//   };

//   return (
//     <Box sx={{ mt: 4, maxWidth: '400px', mx: 'auto' }}> {/* 가운데 정렬 및 최대 너비 설정 */}
//       <PageTitle title="로그인" />
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField
//             label="사용자 이름"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             label="비밀번호"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <Button type="submit" variant="contained" size="large">
//             로그인
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }

// export default Login;