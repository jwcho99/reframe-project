import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // RouterLink로 이름 변경
import axiosInstance from '../api/axiosInstance';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../context/AuthContext';

// MUI 컴포넌트 import
import {
    Box,
    Button,
    Paper,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress, // 로딩 스피너
    Link // MUI Link (제목에 사용)
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Community() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const { user } = useContext(AuthContext);

    // 관리자인지 확인하는 변수
    const isAdmin = user && (user.is_staff || user.is_superuser);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('community/posts/');
            const fetchedPosts = response.data?.results ?? (Array.isArray(response.data) ? response.data : []);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("게시글을 불러오는 데 실패했습니다.", error);
            setPosts([]);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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

    // 로딩 중일 때 스피너 표시
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <PageTitle title="📢 커뮤니티" />
            <Button component={RouterLink} to="/community/new" variant="contained" sx={{ mb: 2 }}>
                새 글 작성하기
            </Button>

            {/* --- 게시글 목록 (테이블 형태) --- */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        {/* TableRow에 연한 배경색을 추가합니다 (예: grey.100) */}
                        <TableRow sx={{ backgroundColor: 'grey.100' }}> 
                            {/* TableCell에 굵은 글꼴(fontWeight: 'bold') 스타일을 적용합니다 */}
                            <TableCell sx={{ width: '60%', fontWeight: 'bold' }}>제목</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>작성자</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>작성일</TableCell>
                            {isAdmin && <TableCell align="right" sx={{ fontWeight: 'bold' }}>관리</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(posts) && posts.length > 0 ? posts.map((post) => (
                            <TableRow
                                key={post.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Link
                                        component={RouterLink}
                                        to={`/community/${post.id}`}
                                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">{post.display_name}</TableCell>
                                <TableCell align="right">{new Date(post.created_at).toLocaleDateString()}</TableCell>
                                {/* 관리자일 때만 삭제 버튼 표시 */}
                                {isAdmin && (
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handlePostDelete(post.id)}
                                            aria-label="delete post"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        )) : (
                            // 게시글이 없을 때
                            <TableRow>
                                <TableCell colSpan={isAdmin ? 4 : 3} align="center">
                                    아직 작성된 게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* --- 여기까지 --- */}
        </Box>
    );
}

export default Community;



// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import PageTitle from '../components/PageTitle';
// import { Button, Box, Paper, Typography, Grid, IconButton, Stack} from '@mui/material'; // Grid, IconButton 추가
// import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 사용
// import { AuthContext } from '../context/AuthContext';

// function Community() {
//     const [posts, setPosts] = useState([]);
//     const { user } = useContext(AuthContext);

//     // fetchPosts 함수 (안정성 강화 버전)
//     const fetchPosts = async () => {
//         try {
//             const response = await axiosInstance.get('community/posts/');
//             const fetchedPosts = response.data?.results ?? (Array.isArray(response.data) ? response.data : []);
//             setPosts(fetchedPosts);
//         } catch (error) {
//             console.error("게시글을 불러오는 데 실패했습니다.", error);
//             setPosts([]);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     // 게시글 삭제 함수
//     const handlePostDelete = async (postId) => {
//         if (window.confirm("정말 이 게시글을 삭제하시겠습니까? (관리자 권한)")) {
//             try {
//                 await axiosInstance.delete(`/community/posts/${postId}/`);
//                 alert("게시글이 삭제되었습니다.");
//                 fetchPosts();
//             } catch (error) {
//                 console.error("게시글 삭제에 실패했습니다.", error);
//                 alert("게시글 삭제에 실패했습니다.");
//             }
//         }
//     };

//     return (
//         <Box>
//         <PageTitle title="📢 커뮤니티" />
//         <Button component={Link} to="/community/new" variant="contained" sx={{ mb: 2 }}>
//             새 글 작성하기
//         </Button>
//         <Stack spacing={2}>
//             {Array.isArray(posts) && posts.length > 0 ? posts.map(post => (
//                 <Paper key={post.id} sx={{ p: 2 }}>
//                     {/* Grid container: 전체 행 */}
//                     <Grid container spacing={1} alignItems="center" justifyContent="space-between">
//                         {/* Grid item: 제목 (왼쪽 영역) */}
//                         <Grid item xs>
//                             <Typography
//                                 variant="h6"
//                                 component={Link}
//                                 to={`/community/${post.id}`}
//                                 sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
//                             >
//                                 {post.title}
//                             </Typography>
//                         </Grid>

//                         {/* Grid item: 작성자/날짜/관리자 버튼 묶음 (오른쪽 영역) */}
//                         <Grid item xs="auto" container spacing={1} alignItems="center">
//                              {/* Grid item: 작성자/날짜 */}
//                             <Grid item sx={{ textAlign: 'right' }}>
//                                 <Typography variant="caption" display="block">
//                                     {/* display_name 사용 */}
//                                     {post.display_name}
//                                 </Typography>
//                                 <Typography variant="caption" display="block" color="text.secondary">
//                                     {new Date(post.created_at).toLocaleDateString()}
//                                 </Typography>
//                             </Grid>
//                             {/* Grid item: 관리자 삭제 버튼 */}
//                             {user && (user.is_staff || user.is_superuser) && (
//                                 <Grid item>
//                                     <IconButton
//                                         size="small"
//                                         color="error"
//                                         onClick={() => handlePostDelete(post.id)}
//                                         aria-label="delete post"
//                                     >
//                                         <DeleteIcon fontSize="small" />
//                                     </IconButton>
//                                 </Grid>
//                             )}
//                         </Grid>
//                     </Grid>
//                 </Paper>
//                 )) : (
//                     // 게시글이 없을 때 메시지
//                      <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
//                          아직 작성된 게시글이 없습니다.
//                      </Typography>
//                  )}
//             </Stack>
//             {/* --- 여기까지 --- */}
//         </Box>
//     );
// }

// export default Community;

// import React, { useState, useEffect, useContext} from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios'; // 1. axios 불러오기
// import PageTitle from '../components/PageTitle';
// import axiosInstance from '../api/axiosInstance';
// import { Button, Box, Paper, Typography } from '@mui/material'; // MUI 컴포넌트 추가
// import { AuthContext } from '../context/AuthContext';

// function Community() {
//   // 2. 게시글 데이터를 저장할 state 생성
//   // 초기값은 빈 배열 [] 입니다.
//   const [posts, setPosts] = useState([]);
//   const { user } = useContext(AuthContext); // 로그인 상태 가져오기 

//   // console.log('현재 로그인된 사용자 정보:', user);

//   // 3. 백엔드에서 데이터를 가져오는 함수
//   const fetchPosts = async () => {
//     try {
//       // Django 서버의 게시글 목록 API에 GET 요청을 보냅니다.
//       const response = await axiosInstance.get('community/posts/');
//       // 성공적으로 데이터를 받아오면, setPosts를 이용해 posts state를 업데이트합니다.
//       // console.log('로컬 API 응답:', response.data); // 확인용 로그
//       setPosts(response.data || []); // 혹시 results가 없을 경우를 대비해 빈 배열([]) 사용
//     } catch (error) {
//       console.error("게시글을 불러오는 데 실패했습니다.", error);
//       setPosts([]); // 에러 발생 시 빈 배열로 설정
//     }
//   };

//   // 4. useEffect: 이 컴포넌트가 처음 화면에 렌더링될 때 딱 한 번만 실행됩니다.
//   useEffect(() => {
//     fetchPosts(); // 데이터를 가져오는 함수 호출
//   }, []); // [] (빈 배열)은 "최초 1회만 실행"하라는 의미입니다.

//   const handlePostDelete = async (postId) => {
//         if (window.confirm("정말 이 게시글을 삭제하시겠습니까? (관리자 권한)")) {
//             try {
//                 await axiosInstance.delete(`/community/posts/${postId}/`);
//                 alert("게시글이 삭제되었습니다.");
//                 fetchPosts(); // 목록 새로고침
//             } catch (error) {
//                 console.error("게시글 삭제에 실패했습니다.", error);
//                 alert("게시글 삭제에 실패했습니다.");
//             }
//         }
//     };

//   return (
//         <Box>
//             <PageTitle title="📢 커뮤니티" />
//             <Button component={Link} to="/community/new" variant="contained" sx={{ mb: 2 }}>
//                 새 글 작성하기
//             </Button>
//             <div className="post-list">
//                 {Array.isArray(posts) && posts.map(post => (
//                     <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Box>
//                                 <Typography variant="h6" component={Link} to={`/community/${post.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
//                                     {post.title}
//                                 </Typography>
//                                 <Typography variant="caption" display="block">
//                                     작성자: {post.author_username || '익명'} | 작성일: {new Date(post.created_at).toLocaleDateString()}
//                                 </Typography>
//                             </Box>
//                             {/* --- 관리자 전용 삭제 버튼 추가 --- */}
//                             {user && (user.is_staff || user.is_superuser) && ( // is_staff 또는 is_superuser 확인
//                                 <Button
//                                     size="small"
//                                     color="error"
//                                     onClick={() => handlePostDelete(post.id)}>
//                                     삭제 (Admin)
//                                 </Button>
//                             )}
//                             {/* --- 여기까지 --- */}
//                         </Box>
//                     </Paper>
//                 ))}
//                 {!Array.isArray(posts) && posts && <p>데이터 형식이 올바르지 않습니다.</p>}
//             </div>
//         </Box>
//     );
// }

// export default Community;