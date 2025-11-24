import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack, Paper, Typography, useTheme } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content, nickname: user ? null : nickname };
    const apiEndpoint = 'community/posts/';

    try {
      if (user) {
        await axiosInstance.post(apiEndpoint, postData);
      } else {
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
    <Box maxWidth="800px" mx="auto" sx={{ mt: 4, mb: 8 }}>
      <PageTitle title="📝 새 글 작성" />
      
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 닉네임 필드 (강조되지 않게 보조적으로 배치) */}
            {!user && (
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">작성자 정보</Typography>
                  <TextField
                    placeholder="닉네임 (선택)"
                    variant="standard"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    sx={{ flexGrow: 1 }}
                  />
               </Box>
            )}

            {/* 제목 필드 (크게 강조) */}
            <TextField
              placeholder="제목을 입력하세요"
              variant="standard"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{ 
                disableUnderline: true,
                style: { fontSize: '1.5rem', fontWeight: 'bold' } 
              }}
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ height: '1px', bgcolor: 'divider' }} />

            {/* 내용 필드 */}
            <TextField
              placeholder="내용을 자유롭게 작성해주세요..."
              variant="standard"
              fullWidth
              multiline
              minRows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              InputProps={{ disableUnderline: true, style: { lineHeight: 1.6 } }}
            />

            {/* 하단 버튼 영역 */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button 
                component={Link} 
                to="/community" 
                variant="outlined" 
                color="inherit" 
                startIcon={<CancelRoundedIcon />}
                size="large"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                endIcon={<SendRoundedIcon />}
                disabled={!title.trim() || !content.trim()} // 내용 없으면 비활성화
                sx={{ px: 4 }}
              >
                등록하기
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default NewPost;



// import React, { useState, useContext } from 'react';
// import axiosInstance from '../api/axiosInstance';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import PageTitle from '../components/PageTitle';
// import { TextField, Button, Box, Stack } from '@mui/material'; // MUI 컴포넌트 import
// import { AuthContext } from '../context/AuthContext';


// function NewPost() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext); // 로그인 상태 가져오기
//   const [nickname, setNickname] = useState('');

//   // console.log('NewPost user state:', user);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

    
//     /* const token = localStorage.getItem('accessToken');
//     if (!token) {
//       alert("로그인이 필요합니다.");
//       navigate('/login');
//       return;
//     } */
//     const postData = { title, content, nickname: user ? null : nickname }; // 로그인 시 null
//     const apiEndpoint = '/community/posts/';


//     try {
//       // --- 이 부분을 수정합니다 ---
//       if (user) {
//         // 로그인 상태: axiosInstance 사용 (자동으로 토큰 첨부)
//         await axiosInstance.post(apiEndpoint, postData);
//       } else {
//         // 로그아웃 상태: 순수 axios 사용
//         // baseURL을 환경 변수에서 가져와 조합합니다.
//         //console.log('Submitting post while logged out:', postData);
//         const baseURL = import.meta.env.VITE_API_BASE_URL;
//         await axios.post(`${baseURL}${apiEndpoint}`, postData);
//       }

//       navigate('/community');
//     } catch (error) {
//       console.error('글을 생성하는 데 실패했습니다.', error);
//       alert('글 작성 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <Box sx={{ mt: 4 }}> {/* 위쪽 여백 추가 */}
//       <PageTitle title="📝 새 글 작성하기" />
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}> {/* 컴포넌트 간 간격 추가 */}
//           {!user && (
//             <TextField
//               label="닉네임 (선택 사항, 기본값: 익명)"
//               variant="outlined"
//               fullWidth
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//             />
//           )}
//           <TextField
//             label="제목"
//             variant="outlined"
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <TextField
//             label="내용"
//             variant="outlined"
//             fullWidth
//             multiline
//             rows={10}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />
//           <Button type="submit" variant="contained" size="large">
//             제출하기
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }

// export default NewPost;