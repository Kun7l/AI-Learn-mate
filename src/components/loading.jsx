import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress color="inherit"/>
    </Box>
  );
}