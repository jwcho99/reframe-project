import { createTheme } from '@mui/material/styles';

// 트렌디한 커스텀 테마 생성
const theme = createTheme({
  // 1. 컬러 팔레트 (Color Palette)
  palette: {
    primary: {
      main: '#6366f1', // 모던한 인디고 (Indigo)
      light: '#818cf8',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // 상큼한 에메랄드 (Emerald)
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // 아주 연한 블루-그레이 배경 (눈이 편안함)
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // 완전 검정 대신 짙은 네이비-그레이 (가독성 UP)
      secondary: '#64748b',
    },
  },

  // 2. 타이포그래피 (Typography) - 프리텐다드 적용
  typography: {
    fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }, // 버튼 텍스트 대문자 자동 변환 방지
  },

  // 3. 컴포넌트 스타일 커스터마이징 (Components Override)
  components: {
    // 버튼: 둥글고 모던하게
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 둥근 모서리
          padding: '8px 16px',
          boxShadow: 'none', // 기본 그림자 제거 (플랫 디자인)
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.2)', // 호버 시 부드러운 빛남 효과
          },
        },
        contained: {
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    // 카드/종이: 부드러운 그림자와 둥근 모서리
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none', // 다크모드 시 그라데이션 제거
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // 아주 은은한 그림자
          border: '1px solid #e2e8f0', // 얇은 테두리 추가
        },
      },
    },
    // 텍스트 필드: 둥글게
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    // 앱바(헤더): 그림자 없애고 배경색 변경
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff', // 배경을 흰색으로 (깔끔함)
          color: '#1e293b', // 글자색을 어둡게
        },
      },
    },
  },
  shape: {
    borderRadius: 12, // 기본 둥글기 설정
  },
});

export default theme;