import React, { memo } from 'react';
import { Box } from '@mui/material';
import { Tooltip, Icon, AlyceTheme } from '@alycecom/ui';

import SortingHeaderCell from './SortingHeaderCell';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  icon: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
    ml: 0.5,
  },
} as const;

const PurchasedGiftCell = (): JSX.Element => (
  <SortingHeaderCell name="purchasedCount" width={200} align="right">
    <Box sx={styles.wrapper}>
      <Box component="span">Purchased</Box>
      <Tooltip title="After gifts are accepted it may take up to 3 days for Alyce to process gifts">
        <Icon sx={styles.icon} icon="info-circle" />
      </Tooltip>
    </Box>
  </SortingHeaderCell>
);

export default memo(PurchasedGiftCell);
