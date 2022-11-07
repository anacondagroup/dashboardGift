import React from 'react';
import { Box, Theme, Typography } from '@mui/material';
import { Icon } from '@alycecom/ui';

const styles = {
  status: {
    color: ({ palette }: Theme) => palette.green.fruitSalad,
    ml: 1,
  },
} as const;

interface IActiveIntegrationsNumberProps {
  activeIntegrations?: number;
}

const ActiveIntegrationsNumber = ({ activeIntegrations = 0 }: IActiveIntegrationsNumberProps): JSX.Element => (
  <Box display="flex" alignItems="center">
    <Icon icon="check" color="default-salad" />
    <Typography sx={styles.status}>{activeIntegrations} Active automations</Typography>
  </Box>
);

export default ActiveIntegrationsNumber;
