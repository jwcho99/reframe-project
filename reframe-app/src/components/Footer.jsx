import React from 'react';
import { Box, Typography, Link, Container, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => theme.palette.background.default,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} <strong>Re:Frame Project</strong>. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={3}>
             <Link href="#" color="inherit" underline="hover" variant="body2">
                About
             </Link>
             <Link href="https://github.com/jwcho99/reframe-project" target="_blank" color="inherit" underline="hover" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <GitHubIcon fontSize="small" /> GitHub
             </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;