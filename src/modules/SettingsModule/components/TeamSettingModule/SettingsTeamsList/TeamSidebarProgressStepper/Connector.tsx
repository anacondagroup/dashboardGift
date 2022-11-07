import React from 'react';
import { StepConnector, Theme } from '@mui/material';

const styles = {
  connector: {
    top: ({ spacing }: Theme) => spacing(1),
    left: 'calc(-55% + 10px)',
    right: 'calc(45% + 10px)',
    zIndex: -1,
    '& .MuiStepConnector-line': {
      borderTopWidth: 2,
      borderColor: ({ palette }: Theme) => palette.grey.superLight,
    },

    '&.MuiStepConnector-root.Mui-active .MuiStepConnector-line, &.MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
      borderTopWidth: 2,
      borderColor: ({ palette }: Theme) => palette.green.superLight,
    },
  },
} as const;

const Connector = (): JSX.Element => <StepConnector sx={styles.connector} />;

export default Connector;
