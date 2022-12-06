import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';

const styles = {
  wrapper: {
    mt: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: ({ palette }: AlyceTheme) => palette.text.primary,
  },
} as const;

const NoDataPlaceholder = (): JSX.Element => (
  <Box sx={styles.wrapper}>
    <Typography sx={styles.title}>No data available</Typography>
  </Box>
);

export default memo(NoDataPlaceholder);
