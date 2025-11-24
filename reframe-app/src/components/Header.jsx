import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  Link, Divider, Tooltip, Stack, Avatar, useTheme, alpha
} from '@mui/material';

// 아이콘 import
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'; // AI 도구
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded'; // 파일 관리
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인용
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const isAdmin = user && (user.is_staff || user.is_superuser);

  // 현재 경로가 path와 일치하는지 확인하는 함수
  const isActive = (path) => location.pathname.startsWith(path);

  // 버튼 스타일 생성 함수 (활성화 여부에 따라 색상 변경)
  const getButtonStyle = (path) => ({
    color: isActive(path) ? 'primary.main' : 'text.secondary',
    fontWeight: isActive(path) ? 'bold' : 'medium',
    backgroundColor: isActive(path) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: 'primary.main',
    },
    px: 2,
    py: 1,
    borderRadius: 3, // 더 둥글게
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        // 글래스모피즘 효과 (배경 블러)
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha('#ffffff', 0.8), 
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
        {/* 1. 로고 영역 */}
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit" 
          underline="none" 
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 2 }}
        >
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              width: 36, 
              height: 36, 
              borderRadius: 1.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="800" letterSpacing="-0.5px" color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Re:Frame
          </Typography>
        </Link>

        {/* 2. 메인 네비게이션 (가운데 정렬 느낌) */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexGrow: 1, overflowX: 'auto' }}>
          <Button 
            component={RouterLink} 
            to="/community" 
            startIcon={<ForumRoundedIcon />}
            sx={getButtonStyle('/community')}
          >
            커뮤니티
          </Button>

          {/* 구분선 */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

          {/* 관리자 메뉴 (Tooltip & Disabled UI 유지) */}
          <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
            <span>
              <Button
                component={RouterLink}
                to="/photo"
                startIcon={<DashboardRoundedIcon />}
                disabled={!isAdmin}
                sx={{
                  ...getButtonStyle('/photo'),
                  // 비활성화 상태일 때 스타일 (흐리게)
                  '&.Mui-disabled': {
                    color: alpha(theme.palette.text.disabled, 0.5),
                    opacity: 0.7
                  }
                }}
              >
                AI 도구
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
            <span>
              <Button
                component={RouterLink}
                to="/admin/files"
                startIcon={<CloudQueueRoundedIcon />}
                disabled={!isAdmin}
                sx={{
                  ...getButtonStyle('/admin/files'),
                  '&.Mui-disabled': {
                    color: alpha(theme.palette.text.disabled, 0.5),
                    opacity: 0.7
                  }
                }}
              >
                파일 관리
              </Button>
            </span>
          </Tooltip>
        </Stack>

        {/* 3. 유저 액션 영역 */}
        <Box>
          {user ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {/* 유저 프로필 캡슐 */}
              <Box sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.08), 
                  py: 0.5, 
                  pl: 0.5, 
                  pr: 2, 
                  borderRadius: 50 
                }}>
                <Avatar 
                  sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  {user.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight="600" color="primary.main">
                  {user.username}
                </Typography>
              </Box>

              <Button 
                variant="outlined" 
                color="inherit" 
                size="small" 
                onClick={handleLogout}
                startIcon={<LogoutRoundedIcon />}
                sx={{ 
                  borderRadius: 2, 
                  borderColor: 'divider', 
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.primary', color: 'text.primary', bgcolor: 'transparent' } 
                }}
              >
                로그아웃
              </Button>
            </Stack>
          ) : (
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="contained" 
              disableElevation
              startIcon={<LoginRoundedIcon />}
              sx={{ borderRadius: 2, fontWeight: 'bold', px: 3 }}
            >
              로그인
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;



// import React, { useContext } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { AppBar, Toolbar, Typography, Button, Box, Link, Divider, Tooltip } from '@mui/material'; // Divider 추가
// function Header() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     alert('로그아웃 되었습니다.');
//     navigate('/');
//   };


//   const isAdmin = user && (user.is_staff || user.is_superuser);



//   return (
//     <AppBar position="static">
//       <Toolbar>
//         {/* 로고/사이트 이름 */}
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           <Link component={RouterLink} to="/" color="inherit" underline="none">
//             Re:Frame
//           </Link>
//         </Typography>

//         {/* 일반 메뉴 */}
//         <Box>
//           <Button color="inherit" component={RouterLink} to="/community">
//             커뮤니티
//           </Button>
//         </Box>

//         {/* --- 관리자 전용 메뉴 영역 --- */}
//         {/* 구분선은 항상 표시 */}
//         <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: 'rgba(20, 17, 17, 0.5 )' }} />
//         <Box>
//           {/* Tooltip: 마우스를 올렸을 때 "관리자 전용" 안내 표시 */}
//           <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
//             {/* Span으로 감싸는 이유: disabled 상태의 버튼에는 Tooltip이 직접 적용되지 않을 수 있음 */}
//             <span>
//               <Button
//                 color="inherit"
//                 component={RouterLink}
//                 to="/photo"
//                 disabled={!isAdmin}
//                 // sx prop을 아래와 같이 수정합니다.
//                 sx={{
//                   // '&.Mui-disabled'는 '이 컴포넌트가 disabled 상태일 때'를 의미합니다.
//                   '&.Mui-disabled': {
//                     color: 'rgba(168, 37, 37, 0.5)' // 흰색에 50% 투명도를 줍니다.
//                   }
//                 }}
//               >
//                 AI 사진 복원
//               </Button>
//             </span>
//           </Tooltip>

//           <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
//             <span>
//               <Button
//                 color="inherit"
//                 component={RouterLink}
//                 to="/admin/files"
//                 disabled={!isAdmin}
//                 // 여기도 동일하게 수정합니다.
//                 sx={{
//                   '&.Mui-disabled': {
//                     color: 'rgba(168, 37, 37, 0.5)'
//                   }
//                 }}
//               >
//                 파일 관리
//               </Button>
//             </span>
//           </Tooltip>
//         </Box>

//         {/* 로그인/로그아웃 버튼 */}
//         <Box sx={{ ml: 2 }}>
//           {user ? (
//             <>
//               <Typography component="span" sx={{ mr: 2 }}>
//                 {user.username}님
//               </Typography>
//               <Button color="inherit" variant="outlined" onClick={handleLogout}>
//                 로그아웃
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" component={RouterLink} to="/login">
//                 관리자 로그인
//               </Button>

//               {/* <Button color="inherit" variant="outlined" component={RouterLink} to="/signup">
//                 회원가입
//               </Button> */}
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default Header;