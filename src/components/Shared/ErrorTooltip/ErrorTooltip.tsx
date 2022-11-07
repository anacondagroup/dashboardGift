import { Box, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import React from 'react';
import { Icon } from '@alycecom/ui';

const ErrorTooltip = styled(({ className, title, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    title={
      <Box display="flex" alignItems="center">
        <Box mr={1}>
          <Icon fontSize="1.1rem" icon="exclamation-circle" />
        </Box>
        {title}
      </Box>
    }
  />
))(({ theme }) => ({
  zIndex: theme.zIndex.modal - 1,
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.error.main,
    boxShadow: `0px 0px 2px 1px ${theme.palette.grey.regular}`,
    fontSize: '0.75rem',
    padding: theme.spacing(1, 2),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.arrow}:before`]: {
    boxShadow: `0px 0px 2px 1px ${theme.palette.grey.regular}`,
  },
}));

export default ErrorTooltip;
