import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Drawer, Theme } from '@mui/material';
import { Features } from '@alycecom/modules';

import {
  getIsTeamSidebarOpen,
  getTeamId,
  getTeamSidebarStep,
  getTeamSidebarTeam,
} from '../../../../store/teams/teamOperation/teamOperation.selectors';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import TeamInfoForm from '../TeamInfoForm/TeamInfoForm';
import TeamBudgetForm from '../TeamBudgetForm/TeamBudgetForm';
import TeamSidebarProgressStepper from '../TeamSidebarProgressStepper/TeamSidebarProgressStepper';
import { STEPS } from '../../../../constants/teamSidebarProgress.constants';

import TeamSidebarHeader from './TeamSidebarHeader';
import BaseSidebarHeader from './BaseSidebarHeader';

const styles = {
  container: {
    '& .MuiDrawer-paper': {
      backgroundColor: ({ palette }: Theme) => palette.common.white,
    },
  },
} as const;

const TeamSidebar = (): JSX.Element => {
  const dispatch = useDispatch();

  const isOpen = useSelector(getIsTeamSidebarOpen);
  const activeStep = useSelector(getTeamSidebarStep);
  const teamId = useSelector(getTeamId);
  const sideBarTeam = useSelector(getTeamSidebarTeam);

  const handleCloseSidebar = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: null }));
  }, [dispatch]);

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  return (
    <Drawer sx={styles.container} anchor="right" open={isOpen} onBackdropClick={handleCloseSidebar}>
      <Box width={600} height="100vh" display="flex" flexDirection="column">
        {teamId ? (
          <TeamSidebarHeader teamId={teamId} onClose={handleCloseSidebar} />
        ) : (
          <BaseSidebarHeader onClose={handleCloseSidebar} />
        )}

        {hasBudgetManagementSetup && <TeamSidebarProgressStepper steps={STEPS} activeStep={activeStep} />}
        {activeStep === TeamSidebarStep.TeamInfo && <TeamInfoForm team={sideBarTeam} />}
        {activeStep === TeamSidebarStep.TeamBudget && teamId && <TeamBudgetForm teamId={teamId} />}
      </Box>
    </Drawer>
  );
};

export default memo(TeamSidebar);
