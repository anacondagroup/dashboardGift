import React from 'react';
import { Box, StepIconProps, Theme } from '@mui/material';
import { Icon } from '@alycecom/ui';

const styles = {
  root: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: ({ palette }: Theme) => `2px solid ${palette.grey.superLight}`,
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  active: {
    borderColor: ({ palette }: Theme) => palette.green.superLight,
  },

  completed: {
    backgroundColor: ({ palette }: Theme) => palette.green.superLight,
    borderColor: ({ palette }: Theme) => palette.green.superLight,
  },
} as const;

const StepIcon = ({ active, completed }: StepIconProps): JSX.Element => {
  if (active) return <Box sx={[styles.root, styles.active]} />;

  if (completed) {
    return (
      <Box sx={[styles.root, styles.completed]}>
        <Icon icon="check" sx={{ width: 12, height: 9, color: '#fff' }} />
      </Box>
    );
  }

  return <Box sx={styles.root} />;
};

export default StepIcon;
