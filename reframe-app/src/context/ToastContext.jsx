import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  // 알림을 띄우는 함수 (모든 컴포넌트에서 사용 가능)
  const showToast = useCallback((msg, type = 'success') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* 화면 중앙 하단에 뜨는 스낵바 컴포넌트 */}
      <Snackbar 
        open={open} 
        autoHideDuration={3000} // 3초 뒤 자동 사라짐
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity} 
          variant="filled" // 색상이 채워진 스타일
          sx={{ width: '100%', boxShadow: 3, fontWeight: 'bold' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// 간편하게 쓰기 위한 커스텀 Hook
export const useToast = () => useContext(ToastContext);