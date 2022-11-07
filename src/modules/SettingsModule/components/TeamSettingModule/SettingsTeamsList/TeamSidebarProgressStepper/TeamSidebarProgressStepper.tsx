import React, { memo, useMemo } from 'react';
import { Box, Step, StepLabel, Stepper, Theme } from '@mui/material';

import { TProgressStep, TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';

import Connector from './Connector';
import StepIcon from './StepIcon';

export interface ITeamSidebarProgressStepperProps {
  steps: Array<TProgressStep>;
  activeStep: TeamSidebarStep | null;
}

const styles = {
  stepper: {
    marginTop: ({ spacing }: Theme) => spacing(2),
  },
  stepLabel: {
    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
      marginTop: ({ spacing }: Theme) => spacing(0.5),
      textTransform: 'uppercase',
      fontSize: 12,
      color: ({ palette }: Theme) => palette.grey.chambray50,
    },
  },
} as const;

const TeamSidebarProgressStepper = ({ steps, activeStep }: ITeamSidebarProgressStepperProps): JSX.Element => {
  const activeStepIdx = useMemo(() => steps.findIndex(step => step.step === activeStep), [steps, activeStep]);

  return (
    <Box>
      <Stepper sx={styles.stepper} activeStep={activeStepIdx} alternativeLabel connector={<Connector />}>
        {steps.map(step => (
          <Step key={step.position}>
            <StepLabel sx={styles.stepLabel} StepIconComponent={StepIcon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default memo(TeamSidebarProgressStepper);
