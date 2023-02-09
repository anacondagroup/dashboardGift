import React from 'react';
import { Box } from '@mui/material';

import InfoIconWithTooltip from '../InfoIconWithTooltip/InfoIconWithTooltip';

import { TRoiColumn } from './roiTable.types';

const styles = {
  headerCellContent: {
    display: 'flex',
    alignItems: 'center',
  },
  tooltipIcon: {
    marginLeft: 1,
    marginRight: 0.5,
  },
} as const;

interface IRoiHeaderColumnMessageProps<RowItem> extends Partial<TRoiColumn<RowItem>> {}

const RoiHeaderColumnMessage = <RowItem,>({
  label,
  tooltipText,
}: IRoiHeaderColumnMessageProps<RowItem>): JSX.Element => (
  <Box sx={styles.headerCellContent}>
    <Box>{label}</Box>
    {tooltipText && (
      <Box sx={styles.tooltipIcon}>
        <InfoIconWithTooltip
          text={tooltipText}
          iconProps={{
            'data-testid': `Column-${label}.InfoIcon`,
          }}
        />
      </Box>
    )}
  </Box>
);

export default RoiHeaderColumnMessage;
