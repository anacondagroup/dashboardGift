import React from 'react';
import { Box, Theme } from '@mui/material';
import { Icon, Tooltip, IIconProps } from '@alycecom/ui';

const styles = {
  tooltip: {
    width: 190,
  },
  tooltipIcon: { color: ({ palette }: Theme) => palette.grey.medium, width: 16, height: 16 },
} as const;

interface IInfoIconWithTooltipProps {
  text: string;
  iconProps?: Omit<IIconProps, 'icon'> & {
    'data-testid'?: string;
  };
}

const InfoIconWithTooltip = ({ text, iconProps = {} }: IInfoIconWithTooltipProps): JSX.Element => (
  <Tooltip title={text} arrow sx={styles.tooltip} placement="top-start">
    <Box display="flex" alignItems="center">
      <Icon
        icon="info-circle"
        {...iconProps}
        sx={
          iconProps.sx
            ? [styles.tooltipIcon, ...(Array.isArray(iconProps.sx) ? iconProps.sx : [iconProps.sx])]
            : styles.tooltipIcon
        }
      />
    </Box>
  </Tooltip>
);

export default InfoIconWithTooltip;
