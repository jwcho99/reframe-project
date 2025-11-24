import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageTitle from '../components/PageTitle';
import { TextField, Button, Box, Stack, Paper, CircularProgress } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
        alert("게시글을 불러올 수 없습니다.");
        navigate('/community');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate]);

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

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" sx={{ mt: 4, mb: 8 }}>
      <PageTitle title="✏️ 게시글 수정" />
      
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            
            {/* 제목 필드 */}
            <TextField
              placeholder="제목을 입력하세요"
              variant="standard"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{ 
                disableUnderline: true,
                style: { fontSize: '1.75rem', fontWeight: '800' } 
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
              InputProps={{ 
                disableUnderline: true, 
                style: { lineHeight: 1.6, fontSize: '1.1rem' } 
              }}
            />

            {/* 하단 버튼 영역 */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button 
                component={Link} 
                to={`/community/${postId}`} // 상세 페이지로 돌아가기
                variant="outlined" 
                color="inherit" 
                startIcon={<CancelRoundedIcon />}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                endIcon={<SaveRoundedIcon />}
                disabled={!title.trim() || !content.trim()}
                sx={{ px: 4, borderRadius: 2, fontWeight: 'bold' }}
              >
                수정 완료
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default EditPost;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance'; // axios instance 사용
// import PageTitle from '../components/PageTitle';
// import { TextField, Button, Box, Stack } from '@mui/material';

// function EditPost() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const { postId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axiosInstance.get(`/community/posts/${postId}/`);
//         setTitle(response.data.title);
//         setContent(response.data.content);
//       } catch (error) {
//         console.error("게시글 정보를 불러오는 데 실패했습니다.", error);
//       }
//     };
//     fetchPost();
//   }, [postId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.put(`/community/posts/${postId}/`, { title, content });
//       alert("게시글이 성공적으로 수정되었습니다.");
//       navigate(`/community/${postId}`);
//     } catch (error) {
//       console.error("게시글 수정에 실패했습니다.", error);
//       alert("게시글 수정에 실패했습니다.");
//     }
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <PageTitle title="📝 게시글 수정하기" />
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}>
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
//             수정 완료
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }

// export default EditPost;