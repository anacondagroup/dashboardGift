import React from 'react';
import { Box } from '@mui/material';
import { Icon, ITooltipProps, Tooltip } from '@alycecom/ui';

interface IWorkatoTooltipProps extends Omit<ITooltipProps, 'title' | 'children'> {
  title: JSX.Element;
}

const WorkatoInfoTooltip = ({ title, ...tooltipProps }: IWorkatoTooltipProps): JSX.Element => (
  <Box ml={1} mt={1.5}>
    <Tooltip title={title} placement="right" {...tooltipProps}>
      <Icon icon="info-circle" color="grey" />
    </Tooltip>
  </Box>
);

export default WorkatoInfoTooltip;
