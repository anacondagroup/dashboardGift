import React, { memo } from 'react';
import { Box, Skeleton } from '@mui/material';

const EmailPreviewSkeleton = () => (
  <Box
    display="flex"
    flexDirection="column"
    width={600}
    height={250}
    alignContent="center"
    justifyContent="space-between"
  >
    <Box width={1} mb={2}>
      <Skeleton width="100%" height={48} />
    </Box>
    <Box width={1} mb={2}>
      <Skeleton width="100%" height={48} />
    </Box>
    <Box width={1} mb={2}>
      <Skeleton width="100%" height={48} />
    </Box>
    <Box width={1} mb={2}>
      <Skeleton width="100%" height={48} />
    </Box>
    <Box width={1} mb={2} textAlign="center">
      <Skeleton width="50%" height={24} />
    </Box>
  </Box>
);

export default memo(EmailPreviewSkeleton);
