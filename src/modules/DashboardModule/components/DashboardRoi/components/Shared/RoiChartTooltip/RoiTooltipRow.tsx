import React from 'react';
import { Box, Theme } from '@mui/material';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',

    '&:not(:last-child)': {
      marginBottom: ({ spacing }: Theme) => spacing(1),
    },
  },
  value: {
    marginLeft: ({ spacing }: Theme) => spacing(3),
    textAlign: 'end',
  },
} as const;

interface IRoiTooltipRowProps {
  label: string;
  value?: string | number;
}

const RoiTooltipRow = ({ label, value = '-' }: IRoiTooltipRowProps): JSX.Element => (
  <Box sx={styles.row}>
    <Box>{label}:</Box>
    <Box sx={styles.value}>{value}</Box>
  </Box>
);

export default RoiTooltipRow;
