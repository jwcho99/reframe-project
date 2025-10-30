import React, { useContext } from 'react';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography, Button, Paper, Stack, Link as MuiLink } from '@mui/material'; // MUI 컴포넌트 추가
import { Link } from 'react-router-dom'; // React Router Link

import Grid from '@mui/material/Grid';

function Home() {
  const { user } = useContext(AuthContext); // 로그인 상태 가져오기

  return (
    <Box>
      <PageTitle title="🚀 Re:Frame에 오신 것을 환영합니다!" />

      <Paper sx={{ p: 3, mb: 3 }}> {/* 소개글 영역 */}
        <Typography variant="h6" gutterBottom>
          About Re:Frame
        </Typography>
        <Typography paragraph>
          Re:Frame은 자유롭게 의견을 나누는 커뮤니티 공간과 개인적인 AI 도구 및 파일 관리를 위한 실험적인 플랫폼입니다.
          다양한 웹 기술(React, Django, GCP 등)을 학습하고 실제 서비스 환경에 적용하는 과정을 담고 있습니다.
        </Typography>
        <Typography paragraph>
          아래 기능들을 자유롭게 이용해보세요!
        </Typography>
      </Paper>

      <Grid container spacing={3}> {/* 기능 안내 영역 */}
        {/* 커뮤니티 섹션 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              📢 커뮤니티
            </Typography>
            <Typography paragraph>
              누구나 자유롭게 글을 쓰고 댓글을 달 수 있는 익명 기반의 커뮤니티입니다.
              로그인 없이 편하게 참여하고 의견을 나눠보세요.
            </Typography> 
            <Button component={Link} to="/community" variant="contained">
              커뮤니티 바로가기
            </Button>
          </Paper>
        </Grid>

        {/* 관리자 전용 기능 섹션 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: user && (user.is_staff || user.is_superuser) ? 'primary.light' : 'grey.200' }}> {/* 관리자일 경우 배경색 강조 */}
            <Typography variant="h6" gutterBottom>
              🔒 관리자 전용 도구
            </Typography>
            <Typography paragraph>
              AI 사진 복원 및 개인 파일 관리 기능은 사이트 관리자(본인)만 사용할 수 있는 특별 기능입니다.
              {/* 로그인 상태가 아니고 관리자가 아닐 때 안내 문구 */}
              {!user && ' 관리자 계정으로 로그인하시면 해당 메뉴가 나타납니다.'}
            </Typography>
            {/* 관리자일 경우 바로가기 버튼 표시 */}
            {user && (user.is_staff || user.is_superuser) && (
              <Stack direction="row" spacing={1}>
                 <Button component={Link} to="/photo" variant="outlined" size="small">
                    AI 사진 복원
                 </Button>
                 <Button component={Link} to="/admin/files" variant="outlined" size="small">
                    파일 관리
                 </Button>
              </Stack>
            )}
             {/* 로그아웃 상태일 때 로그인 버튼 표시 */}
            {!user && (
                 <Button component={Link} to="/login" variant="outlined" size="small">
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