import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Box, Button, TextField, Typography, Paper, Stack, 
    Avatar, IconButton, Divider, useTheme 
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // ... (fetchPost, handleDelete, handleCommentSubmit 등 기존 로직은 그대로 사용)
  // 💡 편의를 위해 로직 부분은 생략하고 UI 부분 위주로 작성합니다. 
  // 기존 파일의 로직 함수들은 그대로 복사해서 넣어주세요!
  
  const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/community/posts/${postId}/`);
        setPost(response.data);
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다.", error);
        navigate('/community');
      }
    };

    useEffect(() => {
      fetchPost();
    }, [postId]);

    const handleDelete = async () => {
      if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
        try {
          await axiosInstance.delete(`/community/posts/${postId}/`);
          navigate('/community');
        } catch (error) {
          alert("게시글 삭제 실패");
        }
      }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const commentData = { content: newComment, nickname: user ? null : '' }; // 닉네임 로직은 기존과 동일하게 처리
        const apiEndpoint = `/community/posts/${postId}/comments/`;
        
        try {
            if (user) await axiosInstance.post(apiEndpoint, commentData);
            else {
                const envBaseURL = import.meta.env.VITE_API_BASE_URL;
                const baseURL = envBaseURL.endsWith('/') ? envBaseURL : `${envBaseURL}/`;
                await axios.post(`${baseURL}${apiEndpoint}`, commentData);
            }
            fetchPost();
            setNewComment('');
        } catch(e) { console.error(e); }
    };

    const handleCommentDelete = async (commentId) => {
        if(window.confirm("삭제하시겠습니까?")) {
            try {
                await axiosInstance.delete(`/community/posts/${postId}/comments/${commentId}/`);
                fetchPost();
            } catch(e) { console.error(e); }
        }
    };

  // ... (댓글 수정 관련 함수들도 기존 코드 그대로 사용) ...
  const handleEditClick = (comment) => {
      setEditingCommentId(comment.id);
      setEditingCommentContent(comment.content);
  };
  const handleCancelEdit = () => {
      setEditingCommentId(null);
      setEditingCommentContent('');
  };
  const handleUpdateSubmit = async (commentId) => {
        try {
            await axiosInstance.patch(`/community/posts/${postId}/comments/${commentId}/`, {
                content: editingCommentContent,
            });
            setEditingCommentId(null);
            fetchPost();
        } catch(e) { console.error(e); }
  };


  if (!post) return null;

  return (
    <Box maxWidth="800px" mx="auto">
      {/* 뒤로가기 버튼 */}
      <Button 
        startIcon={<ArrowBackRoundedIcon />} 
        component={Link} 
        to="/community" 
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        목록으로
      </Button>

      {/* 게시글 본문 카드 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Stack spacing={3}>
            {/* 헤더: 제목 및 메타 정보 */}
            <Box>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    {post.title}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                            {post.display_name ? post.display_name[0] : '익'}
                        </Avatar>
                        <Typography variant="subtitle2" color="text.primary">
                            {post.display_name || '익명'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            • {new Date(post.created_at).toLocaleString()}
                        </Typography>
                    </Stack>
                    
                    {/* 관리 버튼 */}
                    {(user && (user.pk === post.author || user.is_staff || user.is_superuser)) && (
                        <Stack direction="row" spacing={1}>
                            {user.pk === post.author && (
                                <IconButton component={Link} to={`/community/${post.id}/edit`} size="small">
                                    <EditRoundedIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton onClick={handleDelete} size="small" color="error">
                                <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Box>

            <Divider />

            {/* 본문 내용 */}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, minHeight: '200px' }}>
                {post.content}
            </Typography>
        </Stack>
      </Paper>

      {/* 댓글 섹션 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            댓글 <Box component="span" sx={{ bgcolor: 'primary.light', color: 'white', px: 1, borderRadius: 1, fontSize: '0.8rem' }}>{post.comments?.length || 0}</Box>
        </Typography>

        {/* 댓글 작성 폼 */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }} elevation={0}>
             <form onSubmit={handleCommentSubmit}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <TextField
                        fullWidth
                        placeholder="댓글을 남겨보세요..."
                        multiline
                        minRows={1} // 자동 조절
                        maxRows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="standard" // 밑줄 스타일로 깔끔하게
                        InputProps={{ disableUnderline: true }} // 밑줄 제거
                    />
                    <IconButton type="submit" color="primary" disabled={!newComment.trim()}>
                        <SendRoundedIcon />
                    </IconButton>
                </Stack>
             </form>
        </Paper>

        {/* 댓글 목록 */}
        <Stack spacing={2}>
            {post.comments && post.comments.map(comment => (
                <Paper key={comment.id} sx={{ p: 2 }} elevation={0} variant="outlined">
                    {editingCommentId === comment.id ? (
                        // 수정 모드
                        <Box>
                             <TextField
                                fullWidth
                                multiline
                                value={editingCommentContent}
                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button onClick={handleCancelEdit} size="small" color="inherit">취소</Button>
                                <Button onClick={() => handleUpdateSubmit(comment.id)} variant="contained" size="small">수정</Button>
                            </Stack>
                        </Box>
                    ) : (
                        // 일반 모드
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {comment.display_name || '익명'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </Typography>
                                </Stack>
                                
                                {/* 댓글 관리 버튼 */}
                                {(user && (user.pk === comment.author || user.is_staff || user.is_superuser)) && (
                                    <Stack direction="row">
                                        {user.pk === comment.author && (
                                            <IconButton size="small" onClick={() => handleEditClick(comment)} sx={{ p: 0.5 }}>
                                                <EditRoundedIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        <IconButton size="small" color="error" onClick={() => handleCommentDelete(comment.id)} sx={{ p: 0.5 }}>
                                            <DeleteRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                )}
                            </Stack>
                            <Typography variant="body2" color="text.primary">
                                {comment.content}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default PostDetail;

// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import axios from 'axios';
// import PageTitle from '../components/PageTitle';
// import { AuthContext } from '../context/AuthContext';
// import { Box, Button, TextField, Typography, Paper, Stack} from '@mui/material';

// function PostDetail() {
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   // 수정 기능을 위한 state
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editingCommentContent, setEditingCommentContent] = useState('');

//   const [commentNickname, setCommentNickname] = useState(''); // 댓글 닉네임 state 추가

//   // 게시글 데이터를 불러오는 함수
//   const fetchPost = async () => {
//     try {
//       const response = await axiosInstance.get(`/community/posts/${postId}/`);
//       setPost(response.data);
//     } catch (error) {
//       console.error("게시글을 불러오는 데 실패했습니다.", error);
//       navigate('/community'); // 게시글이 없으면 목록으로 이동
//     }
//   };

//   // 컴포넌트가 처음 로드될 때 게시글 데이터를 불러옴
//   useEffect(() => {
//     fetchPost();
//   }, [postId]);

//   // 게시글 삭제 함수
//   const handleDelete = async () => {
//     if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
//       try {
//         await axiosInstance.delete(`/community/posts/${postId}/`);
//         alert("게시글이 삭제되었습니다.");
//         navigate('/community');
//       } catch (error) {
//         console.error("게시글 삭제에 실패했습니다.", error);
//         alert("게시글 삭제에 실패했습니다.");
//       }
//     }
//   };

//   // 댓글 작성 함수
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();

//     if (!newComment.trim()) { 
//       alert("댓글 내용을 입력해주세요.");
//       return; // 함수 종료
//     }

//     const commentData = { content: newComment, nickname: user ? null : commentNickname };
//     // API 엔드포인트 경로 (상대 경로로 사용 가능하나, axios 사용 시 절대 경로 필요)
//     const apiEndpoint = `/community/posts/${postId}/comments/`;

//     try {
//       if (user) {
//         // 로그인 상태: axiosInstance 사용 (자동으로 토큰 첨부)
//         await axiosInstance.post(apiEndpoint, commentData);
//       } else {
//         // 로그아웃 상태: 순수 axios 사용
//         const baseURL = import.meta.env.VITE_API_BASE_URL;
//         await axios.post(`${baseURL}${apiEndpoint}`, commentData);
//       }
//       fetchPost(); // 댓글 목록 새로고침
//       setNewComment(''); // 입력창 비우기
//       setCommentNickname(''); // 닉네임 초기화
//     } catch (error) {
//       console.error('댓글을 작성하는 데 실패했습니다.', error);
//       alert('댓글 작성 중 오류가 발생했습니다.');
//     }
//   };

//   // 댓글 삭제 함수
//   const handleCommentDelete = async (commentId) => {
//     if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
//       try {
//         await axiosInstance.delete(`/community/posts/${postId}/comments/${commentId}/`);
//         alert("댓글이 삭제되었습니다.");
//         fetchPost();
//       } catch (error) {
//         console.error("댓글 삭제에 실패했습니다.", error);
//         alert("댓글 삭제에 실패했습니다.");
//       }
//     }
//   };

//   // --- 댓글 수정 관련 함수들 ---
//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditingCommentContent(comment.content);
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setEditingCommentContent('');
//   };

//   const handleUpdateSubmit = async (commentId) => {
//     try {
//       await axiosInstance.patch(`/community/posts/${postId}/comments/${commentId}/`, {
//         content: editingCommentContent,
//       });
//       alert("댓글이 수정되었습니다.");
//       setEditingCommentId(null);
//       fetchPost();
//     } catch (error) {
//       console.error("댓글 수정에 실패했습니다.", error);
//       alert("댓글 수정에 실패했습니다.");
//     }
//   };
//   // --- 여기까지 ---


//   if (!post) {
//     return <div>로딩 중...</div>;
//   }

//   return (
//     <Box>
//       <PageTitle title={post.title} />
//       <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>{post.content}</Typography>
//       <Typography variant="caption" display="block">
//         작성자: {post.display_name || '익명'} | 작성일: {new Date(post.created_at).toLocaleDateString()}
//       </Typography>
      
//       {/* 게시글 수정/삭제 버튼: 본인 또는 관리자 */}
//       {user && (user.pk === post.author || user.is_staff || user.is_superuser) && (
//         <Box sx={{ mt: 2, mb: 2 }}>
//           {/* 수정 버튼은 본인만 */}
//           {user.pk === post.author && (
//              <Button component={Link} to={`/community/${post.id}/edit`} variant="contained" sx={{ mr: 1 }}>수정</Button>
//           )}
//           {/* 삭제 버튼은 본인 또는 관리자 */}
//           <Button onClick={handleDelete} variant="outlined" color="error">삭제</Button>
//         </Box>
//       )}

//       <hr style={{ margin: '20px 0' }} />

//       <Typography variant="h5" gutterBottom>댓글</Typography>
      
//       {/* 댓글 목록 */}
//       <Box sx={{ mb: 4 }}>
//         {post.comments && post.comments.map(comment => (
//           <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
//             {editingCommentId === comment.id ? (
//               // 수정 모드
//               <Box>
//                 <TextField
//                   fullWidth
//                   multiline
//                   value={editingCommentContent}
//                   onChange={(e) => setEditingCommentContent(e.target.value)}
//                 />
//                 <Box sx={{ mt: 1 }}>
//                   <Button onClick={() => handleUpdateSubmit(comment.id)} variant="contained" size="small" sx={{ mr: 1 }}>수정 완료</Button>
//                   <Button onClick={handleCancelEdit} variant="outlined" size="small">취소</Button>
//                 </Box>
//               </Box>
//             ) : (
//               // 일반 모드
//               <Box>
//                 <Typography variant="body2" sx={{ mb: 1 }}>
//                   <strong>{comment.display_name || '익명'}:</strong> {comment.content}
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography variant="caption" display="block">
//                     작성일: {new Date(comment.created_at).toLocaleDateString()}
//                   </Typography>
                  
//                   {/* 댓글 수정/삭제 버튼: 본인 또는 관리자 */}
//                   {user && (user.pk === comment.author || user.is_staff || user.is_superuser) && ( // 로그인 상태이고 (본인 또는 관리자)일 때 버튼 영역 표시
//                     <Box>
//                       {/* 수정 버튼: 본인 댓글일 때만 표시 */}
//                       {user.pk === comment.author && (
//                         <Button size="small" onClick={() => handleEditClick(comment)}>수정</Button>
//                       )}
//                       {/* 삭제 버튼: 관리자 또는 본인 댓글일 때 표시 */}
//                       <Button size="small" color="error" onClick={() => handleCommentDelete(comment.id)}>삭제</Button>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             )}
//           </Paper>
//         ))}
//         {/* 댓글이 없을 경우 메시지 표시 */}
//         {(!post.comments || post.comments.length === 0) && (
//             <Typography variant="body2" color="text.secondary">아직 댓글이 없습니다.</Typography>
//         )}
//       </Box>
      
//       {/* 댓글 작성 폼 */}
//       <form onSubmit={handleCommentSubmit}>
//         <Stack spacing={1} sx={{ mt: 2 }}> {/* Stack 추가 */}
//             {/* 닉네임 입력 (로그아웃 상태일 때만) */}
//             {!user && (
//                 <TextField
//                     label="닉네임 (선택 사항, 기본값: 익명)"
//                     size="small" // 작은 크기
//                     value={commentNickname}
//                     onChange={(e) => setCommentNickname(e.target.value)}
//                 />
//             )}
//             <TextField
//               fullWidth
//               label="댓글을 입력하세요"
//               multiline
//               rows={3}
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               sx={{ mb: 1 }}
//             />
//             <Button type="submit" variant="contained">댓글 작성</Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }

// export default PostDetail;