import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
// ThemeProvider와 createTheme, 그리고 만든 theme 파일 import
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import theme from './theme'; // Step 2에서 만든 파일

function App() {
  return (
    // 1. ThemeProvider로 앱 전체를 감싸줍니다.
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 브라우저 기본 CSS 초기화 및 배경색 적용 */}
      
      {/* 전체 레이아웃 구조 */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Container에 상하 여백(py)을 넉넉하게 줍니다 */}
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;