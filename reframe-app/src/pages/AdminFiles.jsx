import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../context/AuthContext';
import { 
    Box, Button, TextField, IconButton, Typography, 
    CircularProgress, Paper, Stack, Grid, Avatar, useTheme, alpha
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';

function AdminFiles() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useContext(AuthContext);
    const theme = useTheme();

    // 파일 목록 가져오기
    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('community/admin-files/');
            setFiles(response.data.results || (Array.isArray(response.data) ? response.data : []));
        } catch (error) {
            console.error("파일 목록 로딩 실패", error);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchFiles(); }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 파일 업로드 처리
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);

        try {
            await axiosInstance.post('community/admin-files/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSelectedFile(null);
            setDescription('');
            fetchFiles(); // 목록 새로고침
            alert('파일이 성공적으로 업로드되었습니다.');
        } catch (error) {
            alert('업로드 실패');
        } finally {
            setIsUploading(false);
        }
    };

    // 파일 삭제 처리
    const handleDelete = async (fileId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await axiosInstance.delete(`community/admin-files/${fileId}/`);
                fetchFiles(); // 목록 새로고침
                alert('파일이 삭제되었습니다.');
            } catch (error) {
                alert("삭제 실패");
            }
        }
    };

    // 파일 이름 추출 헬퍼 함수
    const getFileNameFromUrl = (url) => {
         if (!url) return 'Unknown';
         const match = url.match(/[^/\\&?]+\.\w{3,4}(?=([?&].*$|$))/);
         return match ? decodeURIComponent(match[0]) : 'Unknown';
    }

    return (
        <Box sx={{ mt: 4, mb: 8 }}>
            <PageTitle title="☁️ 개인 클라우드" />
            
            {/* 업로드 영역 (모던한 디자인 적용) */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    mb: 6, 
                    border: '2px dashed', 
                    borderColor: isUploading ? 'primary.main' : 'divider', 
                    bgcolor: isUploading ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                    borderRadius: 4,
                    transition: 'all 0.3s ease'
                }}
            >
                <Stack spacing={3} alignItems="center">
                    <Box sx={{ 
                        width: 64, height: 64, borderRadius: '50%', 
                        bgcolor: 'primary.light', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white'
                    }}>
                        <UploadFileRoundedIcon fontSize="large" />
                    </Box>
                    
                    <Box width="100%" maxWidth="600px">
                        <form onSubmit={handleUpload}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button variant="outlined" component="label" sx={{ minWidth: 120, height: 56 }}>
                                        파일 선택
                                        <input type="file" hidden onChange={handleFileChange} />
                                    </Button>
                                    <TextField
                                        placeholder={selectedFile ? selectedFile.name : "파일을 선택해주세요"}
                                        value={selectedFile ? selectedFile.name : ""}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                        sx={{ bgcolor: 'action.hover', borderRadius: 1 }}
                                    />
                                </Stack>
                                <TextField
                                    label="파일 설명 (선택)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large"
                                    disabled={isUploading || !selectedFile}
                                    startIcon={isUploading && <CircularProgress size={20} color="inherit" />}
                                    sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                                >
                                    {isUploading ? '업로드 중...' : '업로드 시작'}
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Paper>

            {/* 파일 목록 섹션 */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsertDriveFileRoundedIcon color="primary" />
                저장된 파일 <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', fontSize: '1rem' }}>({files.length})</Box>
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={2}>
                    {files.map((file) => (
                        <Grid item xs={12} sm={6} md={4} key={file.id}>
                            <Paper 
                                variant="outlined"
                                sx={{ 
                                    p: 2.5, 
                                    borderRadius: 3,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        borderColor: 'primary.main', 
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transform: 'translateY(-2px)'
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                                    <DescriptionRoundedIcon />
                                </Avatar>
                                
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle2" noWrap fontWeight="bold" title={getFileNameFromUrl(file.file)}>
                                        {getFileNameFromUrl(file.file)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                        {file.description || '설명 없음'}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        {new Date(file.uploaded_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Stack spacing={0.5}>
                                     {/* 다운로드 버튼: href와 download 속성 사용 */}
                                     <IconButton 
                                        href={file.file} 
                                        download={getFileNameFromUrl(file.file)}
                                        size="small" 
                                        color="primary"
                                        sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
                                    >
                                        <DownloadRoundedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleDelete(file.id)} 
                                        size="small" 
                                        color="error"
                                        sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
                                    >
                                        <DeleteRoundedIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                    {files.length === 0 && !isLoading && (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary', bgcolor: 'background.default', borderRadius: 4 }}>
                                <Typography>저장된 파일이 없습니다.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
}

export default AdminFiles;

// import React, { useState, useEffect, useContext } from 'react';
// import axiosInstance from '../api/axiosInstance';
// import PageTitle from '../components/PageTitle';
// import { AuthContext } from '../context/AuthContext';
// import { 
//     Box, Button, TextField, IconButton, Typography, 
//     CircularProgress, Paper, Stack, Grid, Divider 
// } from '@mui/material';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
// import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
// import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

// function AdminFiles() {
//     // ... (기존 로직 함수들 fetchFiles, handleUpload, handleDelete, handleDownload 등 그대로 사용) ...
//     // 로직 부분은 기존 파일에서 복사해오세요!

//     // 예시를 위해 UI 부분만 작성합니다.
    
//     return (
//         <Box sx={{ mt: 4 }}>
//             <PageTitle title="☁️ 파일 저장소" />
            
//             {/* 업로드 섹션 */}
//             <Paper sx={{ p: 3, mb: 4, border: '1px dashed', borderColor: 'primary.main', bgcolor: 'primary.50' }} elevation={0}>
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
//                     <UploadFileRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
//                     <Box sx={{ flexGrow: 1, width: '100%' }}>
//                         <form onSubmit={handleUpload}>
//                             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                                 <TextField
//                                     label="파일 설명"
//                                     size="small"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     fullWidth
//                                     variant="outlined"
//                                     sx={{ bgcolor: 'white' }}
//                                 />
//                                 <Button variant="outlined" component="label" sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
//                                     파일 선택
//                                     <input type="file" hidden onChange={handleFileChange} />
//                                 </Button>
//                                 <Button 
//                                     type="submit" 
//                                     variant="contained" 
//                                     disabled={isUploading || !selectedFile}
//                                     startIcon={isUploading && <CircularProgress size={20} color="inherit" />}
//                                 >
//                                     업로드
//                                 </Button>
//                             </Stack>
//                             {selectedFile && (
//                                 <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
//                                     선택됨: {selectedFile.name}
//                                 </Typography>
//                             )}
//                         </form>
//                     </Box>
//                 </Stack>
//             </Paper>

//             {/* 파일 목록 섹션 */}
//             <Typography variant="h6" gutterBottom fontWeight="bold">
//                 업로드된 파일 ({files.length})
//             </Typography>

//             <Grid container spacing={2}>
//                 {files.map((file) => (
//                     <Grid item xs={12} sm={6} md={4} key={file.id}>
//                         <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <Stack direction="row" spacing={2} alignItems="center" sx={{ overflow: 'hidden' }}>
//                                 <Avatar sx={{ bgcolor: 'secondary.light' }}>
//                                     <DescriptionRoundedIcon />
//                                 </Avatar>
//                                 <Box sx={{ minWidth: 0 }}> {/* 텍스트 말줄임 처리를 위해 필요 */}
//                                     <Typography variant="subtitle2" noWrap fontWeight="bold">
//                                         {getFileNameFromUrl(file.file)}
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary" noWrap display="block">
//                                         {file.description || '설명 없음'}
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary">
//                                         {new Date(file.uploaded_at).toLocaleDateString()}
//                                     </Typography>
//                                 </Box>
//                             </Stack>
                            
//                             <Stack>
//                                 <IconButton 
//                                     color="primary" 
//                                     href={file.file} 
//                                     download={getFileNameFromUrl(file.file)}
//                                 >
//                                     <DownloadRoundedIcon />
//                                 </IconButton>
//                                 <IconButton 
//                                     color="error" 
//                                     size="small" 
//                                     onClick={() => handleDelete(file.id)}
//                                 >
//                                     <DeleteRoundedIcon fontSize="small" />
//                                 </IconButton>
//                             </Stack>
//                         </Paper>
//                     </Grid>
//                 ))}
//                 {files.length === 0 && !isLoading && (
//                     <Grid item xs={12}>
//                          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }} elevation={0}>
//                             <Typography color="text.secondary">업로드된 파일이 없습니다.</Typography>
//                          </Paper>
//                     </Grid>
//                 )}
//             </Grid>
//         </Box>
//     );
// }
// export default AdminFiles;

// import React, { useState, useEffect, useContext } from 'react';
// import axiosInstance from '../api/axiosInstance';
// import PageTitle from '../components/PageTitle';
// import { AuthContext } from '../context/AuthContext';
// import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, CircularProgress, Paper, Stack } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
// import DownloadIcon from '@mui/icons-material/Download'; // 다운로드 아이콘 추가

// function AdminFiles() {
//     const [files, setFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [description, setDescription] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const { user } = useContext(AuthContext);

//     // 파일 목록을 가져오는 함수
//     const fetchFiles = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axiosInstance.get('community/admin-files/');
//             setFiles(response.data.results || (Array.isArray(response.data) ? response.data : []));
//         } catch (error) {
//             console.error("파일 목록을 불러오는 데 실패했습니다.", error);
//             setFiles([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 컴포넌트 로드 시 파일 목록 가져오기
//     useEffect(() => {
//         fetchFiles();
//     }, []);

//     const handleDownload = async (fileUrl, fileName) => {
//         try {
//             const response = await fetch(fileUrl);
//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = blobUrl;
//             link.setAttribute('download', fileName || 'download'); // 파일 이름 지정
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//             window.URL.revokeObjectURL(blobUrl);
//         } catch (error) {
//             console.error("다운로드 중 오류 발생:", error);
//             alert("파일 다운로드 중 오류가 발생했습니다.");
//             // 실패 시 새 탭에서 열기
//             window.open(fileUrl, '_blank');
//         }
//     };

//     // 파일 선택 처리
//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     };

//     // 파일 업로드 처리
//     const handleUpload = async (e) => {
//         e.preventDefault();
//         if (!selectedFile) {
//             alert('업로드할 파일을 선택해주세요.');
//             return;
//         }
//         setIsUploading(true);
//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         formData.append('description', description);

//         try {
//             await axiosInstance.post('community/admin-files/', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             alert('파일이 성공적으로 업로드되었습니다.');
//             setSelectedFile(null); // 파일 선택 초기화
//             setDescription('');   // 설명 초기화
//             fetchFiles();        // 목록 새로고침
//         } catch (error) {
//             console.error('파일 업로드에 실패했습니다.', error);
//             alert('파일 업로드에 실패했습니다.');
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     // 파일 삭제 처리
//     const handleDelete = async (fileId) => {
//         if (window.confirm("정말 이 파일을 삭제하시겠습니까?")) {
//             try {
//                 await axiosInstance.delete(`community/admin-files/${fileId}/`);
//                 alert('파일이 삭제되었습니다.');
//                 fetchFiles(); // 목록 새로고침
//             } catch (error) {
//                 console.error("파일 삭제에 실패했습니다.", error);
//                 alert("파일 삭제에 실패했습니다.");
//             }
//         }
//     };

//     // Django FileField URL에서 파일 이름 추출 (정규식 사용)
//     const getFileNameFromUrl = (url) => {
//          // URL에서 마지막 '/' 이후의 문자열을 찾고, URL 파라미터(? 뒤)는 제외
//          const match = url.match(/[^/\\&?]+\.\w{3,4}(?=([?&].*$|$))/);
//          return match ? decodeURIComponent(match[0]) : '파일 이름 없음';
//     }

//     return (
//         <Box sx={{ mt: 4, mb: 4 }}>
//             <PageTitle title="☁️ 관리자 파일 저장소" />

//             {/* 파일 업로드 폼 */}
//             <Paper sx={{ p: 3, mb: 4 }}>
//                 <Typography variant="h6" gutterBottom>새 파일 업로드</Typography>
//                 <form onSubmit={handleUpload}>
//                     <Stack spacing={2}>
//                         <TextField
//                             label="파일 설명 (선택 사항)"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             fullWidth
//                         />
//                         <Button variant="contained" component="label" disabled={isUploading}>
//                             파일 선택
//                             <input type="file" hidden onChange={handleFileChange} />
//                         </Button>
//                         {selectedFile && <Typography variant="body2">선택된 파일: {selectedFile.name}</Typography>}
//                         <Button type="submit" variant="contained" color="primary" disabled={isUploading || !selectedFile}>
//                             {isUploading ? <CircularProgress size={24} /> : '업로드'}
//                         </Button>
//                     </Stack>
//                 </form>
//             </Paper>

//             {/* 파일 목록 */}
//             <Typography variant="h6" gutterBottom>업로드된 파일 목록</Typography>
//             {isLoading ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//                     <CircularProgress />
//                 </Box>
//             ) : (
//                 <List>
//                     {files.length > 0 ? files.map((file) => (
//                         <ListItem
//                             key={file.id}
//                             secondaryAction={ // 오른쪽에 버튼 추가
//                                 <>
//                                     {/* 다운로드 버튼: 파일 URL로 직접 연결 */}
//                                     <IconButton edge="end" aria-label="download" onClick={() => handleDownload(file.file, getFileNameFromUrl(file.file))}>
//                                         <DownloadIcon />
//                                     </IconButton>
//                                     {/* 삭제 버튼 */}
//                                     <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.id)} sx={{ ml: 1 }}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </>
//                             }
//                             sx={{ borderBottom: '1px solid #eee' }} // 구분선
//                         >
//                             <ListItemText
//                                 primary={getFileNameFromUrl(file.file)} // 파일 이름 표시
//                                 secondary={ // 파일 설명과 업로드 날짜 표시
//                                     <>
//                                         <Typography component="span" variant="body2" color="text.primary">
//                                             {file.description || '설명 없음'}
//                                         </Typography>
//                                         {" — "}{new Date(file.uploaded_at).toLocaleString()} {/* 날짜 형식 변경 */}
//                                     </>
//                                 }
//                             />
//                         </ListItem>
//                     )) : (
//                         <Typography>업로드된 파일이 없습니다.</Typography>
//                     )}
//                 </List>
//             )}
//         </Box>
//     );
// }

// export default AdminFiles;