import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack, 
  Avatar, 
  useTheme,
  Container
} from '@mui/material';
import Grid from '@mui/material/Grid'; // ⭐️ Grid2 대신 Grid로 변경 (호환성 해결)
import { Link } from 'react-router-dom';

// 트렌디한 아이콘 import
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'; 
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'; 
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'; 

function Home() {
  const { user } = useContext(AuthContext);
  const theme = useTheme(); 

  const isAdmin = user && (user.is_staff || user.is_superuser);

  return (
    <Box>
      {/* 1. Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
          color: 'white',
          boxShadow: '0px 10px 40px rgba(99, 102, 241, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        
        <Stack spacing={2} alignItems="flex-start">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.5, borderRadius: 20 }}>
            <AutoAwesomeIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">Welcome to Re:Frame</Typography>
          </Box>
          
          <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 1 }}>
            기억을 복원하고,<br />생각을 공유하세요.
          </Typography>
          
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, fontWeight: 400 }}>
            Re:Frame은 최신 AI 기술과 커뮤니티가 만나는 실험적인 플랫폼입니다. 
            React, Django, GCP 기술 스택을 기반으로 구축되었습니다.
          </Typography>
        </Stack>
      </Box>

      {/* 2. 기능 안내 섹션 */}
      <Grid container spacing={4}>
        
        {/* 커뮤니티 카드 */}
        <Grid size={{ xs: 12, md: 6 }}> {/* ⭐️ size prop 유지 (이전에 작동 확인됨) */}
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              transition: 'all 0.3s ease',
              cursor: 'default',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main
              },
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56, mb: 2 }}>
              <ForumRoundedIcon sx={{ fontSize: 32, color: 'white' }} />
            </Avatar>
            
            <Typography variant="h5" gutterBottom fontWeight="bold">
              익명 커뮤니티
            </Typography>
            <Typography paragraph color="text.secondary" sx={{ flexGrow: 1 }}>
              로그인 없이 자유롭게 참여하세요. 누구나 글을 쓰고 댓글을 달며 
              다양한 의견을 나눌 수 있는 열린 공간입니다.
            </Typography>
            
            <Button 
              component={Link} 
              to="/community" 
              variant="text" 
              color="secondary"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 2, fontWeight: 'bold', fontSize: '1rem' }}
            >
              커뮤니티 입장하기
            </Button>
          </Paper>
        </Grid>

        {/* 관리자 도구 카드 */}
        <Grid size={{ xs: 12, md: 6 }}> {/* ⭐️ size prop 유지 */}
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: isAdmin ? 'background.paper' : 'action.hover',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[4],
              }
            }}
          >
            <Avatar sx={{ bgcolor: isAdmin ? 'primary.main' : 'grey.400', width: 56, height: 56, mb: 2 }}>
              <AdminPanelSettingsRoundedIcon sx={{ fontSize: 32, color: 'white' }} />
            </Avatar>
            
            <Typography variant="h5" gutterBottom fontWeight="bold">
              관리자 스튜디오
            </Typography>
            <Typography paragraph color="text.secondary" sx={{ flexGrow: 1 }}>
              AI 사진 복원 도구와 개인 클라우드 파일 저장소입니다. 
              관리자 권한이 있는 사용자만 접근하여 고급 기능을 사용할 수 있습니다.
            </Typography>

            {isAdmin ? (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                 <Button component={Link} to="/photo" variant="contained" size="medium">
                    AI 도구
                 </Button>
                 <Button component={Link} to="/admin/files" variant="outlined" size="medium">
                    파일 관리
                 </Button>
              </Stack>
            ) : (
               <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
               >
                  관리자 로그인
               </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;

// import React, { useContext } from 'react';
// import PageTitle from '../components/PageTitle';
// import { AuthContext } from '../context/AuthContext';
// import { Box, Typography, Button, Paper, Stack, Link as MuiLink } from '@mui/material'; // MUI 컴포넌트 추가
// import { Link } from 'react-router-dom'; // React Router Link

// import Grid from '@mui/material/Grid';

// function Home() {
//   const { user } = useContext(AuthContext); // 로그인 상태 가져오기

//   return (
//     <Box>
//       <PageTitle title="🚀 Re:Frame에 오신 것을 환영합니다!" />

//       <Paper sx={{ p: 3, mb: 3 }}> {/* 소개글 영역 */}
//         <Typography variant="h6" gutterBottom>
//           About Re:Frame
//         </Typography>
//         <Typography paragraph>
//           Re:Frame은 자유롭게 의견을 나누는 커뮤니티 공간과 개인적인 AI 도구 및 파일 관리를 위한 실험적인 플랫폼입니다.
//           다양한 웹 기술(React, Django, GCP 등)을 학습하고 실제 서비스 환경에 적용하는 과정을 담고 있습니다.
//         </Typography>
//         <Typography paragraph>
//           아래 기능들을 자유롭게 이용해보세요!
//         </Typography>
//       </Paper>

//       <Grid container spacing={3}> {/* 기능 안내 영역 */}
//         {/* 커뮤니티 섹션 */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Typography variant="h6" gutterBottom>
//               📢 커뮤니티
//             </Typography>
//             <Typography paragraph>
//               누구나 자유롭게 글을 쓰고 댓글을 달 수 있는 익명 기반의 커뮤니티입니다.
//               로그인 없이 편하게 참여하고 의견을 나눠보세요.
//             </Typography> 
//             <Button component={Link} to="/community" variant="contained">
//               커뮤니티 바로가기
//             </Button>
//           </Paper>
//         </Grid>

//         {/* 관리자 전용 기능 섹션 */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3, height: '100%', backgroundColor: user && (user.is_staff || user.is_superuser) ? 'primary.light' : 'grey.200' }}> {/* 관리자일 경우 배경색 강조 */}
//             <Typography variant="h6" gutterBottom>
//               🔒 관리자 전용 도구
//             </Typography>
//             <Typography paragraph>
//               AI 사진 복원 및 개인 파일 관리 기능은 사이트 관리자(본인)만 사용할 수 있는 특별 기능입니다.
//               {/* 로그인 상태가 아니고 관리자가 아닐 때 안내 문구 */}
//               {!user && ' 관리자 계정으로 로그인하시면 해당 메뉴가 나타납니다.'}
//             </Typography>
//             {/* 관리자일 경우 바로가기 버튼 표시 */}
//             {user && (user.is_staff || user.is_superuser) && (
//               <Stack direction="row" spacing={1}>
//                  <Button component={Link} to="/photo" variant="outlined" size="small">
//                     AI 사진 복원
//                  </Button>
//                  <Button component={Link} to="/admin/files" variant="outlined" size="small">
//                     파일 관리
//                  </Button>
//               </Stack>
//             )}
//              {/* 로그아웃 상태일 때 로그인 버튼 표시 */}
//             {!user && (
//                  <Button component={Link} to="/login" variant="outlined" size="small">
//                     관리자 로그인
//                  </Button>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// export default Home;