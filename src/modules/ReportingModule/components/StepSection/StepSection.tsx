import React, { memo, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import { ReportingStepTitle, ReportingSidebarStep } from '../../store/reporting/reporting.constants';

export interface IStepSectionProps {
  step: ReportingSidebarStep;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  subtitle: {
    fontSize: 12,
    color: palette.text.primary,
  },
}));

const StepSection = ({ step, title, subtitle, children }: IStepSectionProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      p={3}
      height="calc(100vh - 80px)"
      bgcolor="common.white"
    >
      <Box mb={3}>
        <Typography className="H4-Chambray">{title || ReportingStepTitle[step]}</Typography>
        {subtitle && <Typography className={classes.subtitle}>{subtitle}</Typography>}
      </Box>
      <Box width={1}>{children}</Box>
    </Box>
  );
};

export default memo(StepSection);
