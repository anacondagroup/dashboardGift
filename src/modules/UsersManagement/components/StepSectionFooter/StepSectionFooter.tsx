import React, { memo, ReactNode } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  step: {
    fontSize: 18,
    color: palette.grey.chambray50,
  },
  nextButton: {
    width: 130,
    height: 48,
    color: palette.link.main,
  },
}));

export interface IStepSectionFooterProps extends BoxProps {
  stepNumber: number;
  stepsCount: number;
  backButton?: ReactNode;
  nextButton?: ReactNode;
}

const StepSectionFooter = ({
  stepNumber,
  stepsCount,
  backButton,
  nextButton,
  ...wrapperProps
}: IStepSectionFooterProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box width={1} display="flex" alignItems="center" justifyContent="space-between" {...wrapperProps}>
      {backButton || <Box width={130}>&nbsp;</Box>}
      <Typography className={classes.step}>
        step {stepNumber}/{stepsCount}
      </Typography>
      {nextButton || <Box width={130}>&nbsp;</Box>}
    </Box>
  );
};

export default memo(StepSectionFooter);
