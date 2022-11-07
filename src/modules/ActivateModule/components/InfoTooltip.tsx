import React from 'react';
import { Icon } from '@alycecom/ui';
import { Box, BoxProps, Tooltip } from '@mui/material';

interface IInfoTooltipProps extends BoxProps {
  title?: string;
  children?: React.ReactNode;
}

const InfoTooltip = ({ title = '', children, ...boxProps }: IInfoTooltipProps): JSX.Element => (
  <Tooltip title={children || title}>
    <Box display="inline-block" height={20} {...boxProps}>
      <Icon icon="info-circle" color="grey" />
    </Box>
  </Tooltip>
);

export default InfoTooltip;
