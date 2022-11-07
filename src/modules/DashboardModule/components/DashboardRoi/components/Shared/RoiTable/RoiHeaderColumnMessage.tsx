import React from 'react';
import { Box } from '@mui/material';

import InfoIconWithTooltip from '../InfoIconWithTooltip/InfoIconWithTooltip';

import { TRoiColumn } from './roiTable.types';

const styles = {
  headerCellContent: {
    position: 'relative',
  },
  tooltipIcon: {
    position: 'absolute',
    top: '50%',
    marginTop: '-6px',
    right: '-20px',
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
