import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 로고/사이트 이름 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Re:Frame
          </Link>
        </Typography>

        {/* 메뉴 링크들 */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/community">
            커뮤니티
          </Button>
          <Button color="inherit" component={RouterLink} to="/photo">
            AI 사진 복원
          </Button>
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
                로그인
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