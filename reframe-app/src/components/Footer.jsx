import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box 
      sx={{ 
        py: 3, // padding-top, padding-bottom
        px: 2, // padding-left, padding-right
        mt: 'auto', // 내용이 적을 때 푸터를 아래로 밀어냄
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
      component="footer"
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://your-github-link.com/">
          Re:Frame Project
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
}

export default Footer;