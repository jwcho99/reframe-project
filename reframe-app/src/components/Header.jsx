import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Link, Divider, Tooltip } from '@mui/material'; // Divider 추가
function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };


  const isAdmin = user && (user.is_staff || user.is_superuser);



  return (
    <AppBar position="static">
      <Toolbar>
        {/* 로고/사이트 이름 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Re:Frame
          </Link>
        </Typography>

        {/* 일반 메뉴 */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/community">
            커뮤니티
          </Button>
        </Box>

        {/* --- 관리자 전용 메뉴 영역 --- */}
        {/* 구분선은 항상 표시 */}
        <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: 'rgba(20, 17, 17, 0.5 )' }} />
        <Box>
          {/* Tooltip: 마우스를 올렸을 때 "관리자 전용" 안내 표시 */}
          <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
            {/* Span으로 감싸는 이유: disabled 상태의 버튼에는 Tooltip이 직접 적용되지 않을 수 있음 */}
            <span>
              <Button
                color="inherit"
                component={RouterLink}
                to="/photo"
                disabled={!isAdmin}
                // sx prop을 아래와 같이 수정합니다.
                sx={{
                  // '&.Mui-disabled'는 '이 컴포넌트가 disabled 상태일 때'를 의미합니다.
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)' // 흰색에 50% 투명도를 줍니다.
                  }
                }}
              >
                AI 사진 복원
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={!isAdmin ? "관리자 전용 기능입니다." : ""}>
            <span>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/files"
                disabled={!isAdmin}
                // 여기도 동일하게 수정합니다.
                sx={{
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                파일 관리
              </Button>
            </span>
          </Tooltip>
        </Box>

        {/* 로그인/로그아웃 버튼 */}
        <Box sx={{ ml: 2 }}>
          {user ? (
            <>
              <Typography component="span" sx={{ mr: 2 }}>
                {user.username}님
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                관리자 로그인
              </Button>

              {/* <Button color="inherit" variant="outlined" component={RouterLink} to="/signup">
                회원가입
              </Button> */}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;