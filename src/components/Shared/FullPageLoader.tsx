import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const FullPageLoader = (): JSX.Element => (
  <Box display="flex" height="100vh">
    <Box display="flex" flex={1} alignItems="center" justifyContent="center">
      <CircularProgress />
    </Box>
  </Box>
);

export default FullPageLoader;
