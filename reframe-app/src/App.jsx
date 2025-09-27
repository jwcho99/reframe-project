import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { CssBaseline, Container } from '@mui/material'; // CssBaseline과 Container import

function App() {
  return (
    <div>
      <CssBaseline /> {/* 브라우저 기본 CSS를 초기화하여 일관된 스타일 적용 */}
      <Header />
      <main>
        {/* Container는 내용물이 너무 넓어지지 않게 양쪽에 적절한 여백을 줍니다 */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;