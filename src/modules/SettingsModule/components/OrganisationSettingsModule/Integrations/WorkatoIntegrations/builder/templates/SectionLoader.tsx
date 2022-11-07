import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface ISectionLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const SectionLoader = ({ isLoading, children }: ISectionLoaderProps): JSX.Element => {
  if (isLoading) {
    return (
      <Box width="100%" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default SectionLoader;
