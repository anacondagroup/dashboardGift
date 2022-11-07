import React, { memo, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import { USERS_CREATING_STEPS } from '../../store/usersOperation/usersOperations.constants';

export interface IStepSectionProps {
  step: UsersSidebarStep;
  children: ReactNode;
}

const StepSection = ({ step, children }: IStepSectionProps): JSX.Element => {
  const { title, subTitle } = USERS_CREATING_STEPS[step];
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
        <Typography className="H4-Chambray">{title}</Typography>
        {subTitle && <Typography className="Body-Regular-Left-Chambray">{subTitle}</Typography>}
      </Box>
      <Box width={1}>{children}</Box>
    </Box>
  );
};

export default memo(StepSection);
