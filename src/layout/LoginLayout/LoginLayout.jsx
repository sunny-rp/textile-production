import React from 'react';
import { Box } from '@mui/material';

export default function LoginLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        padding: '2rem',
      }}
    >
      {children}
    </Box>
  );
}
