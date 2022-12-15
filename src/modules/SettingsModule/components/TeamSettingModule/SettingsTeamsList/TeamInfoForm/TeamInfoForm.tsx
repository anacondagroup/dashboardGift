import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useExternalErrors } from '@alycecom/hooks';
import { Divider } from '@alycecom/ui';
import { Features } from '@alycecom/modules';

import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { createTeam, renameTeam } from '../../../../store/teams/team/team.actions';
import { getErrors, getIsTeamUpdating } from '../../../../store/teams/team/team.selectors';
import { TeamField, TTeamFormParams } from '../../../../store/teams/team/team.types';
import { teamInfoFormDefaultValues, teamInfoFormResolver } from '../../../../store/teams/team/team.schemas';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import { NEW_BILLING_GROUP_ID } from '../../../../store/teams/team/team.constants';
import { getTeamSidebarTeam } from '../../../../store/teams/teamOperation/teamOperation.selectors';

import TeamName from './Fields/TeamName';
import BillingGroup from './Fields/BillingGroup';
import { styles } from './TeamInfoForm.styles';
import GroupName from './Fields/GroupName';

const TeamInfoForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const team = useSelector(getTeamSidebarTeam);
  const isUpdating = useSelector(getIsTeamUpdating);
  const externalErrors = useSelector(getErrors);

  const methods = useForm<TTeamFormParams>({
    mode: 'all',
    defaultValues: teamInfoFormDefaultValues,
    resolver: teamInfoFormResolver,
  });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty },
    watch,
  } = methods;

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const billingGroupId = watch(TeamField.GroupId);
  const isGroupNameVisible = billingGroupId === NEW_BILLING_GROUP_ID;

  const handleCreateTeam = useCallback(
    (data: TTeamFormParams) => {
      dispatch(createTeam(data));
    },
    [dispatch],
  );

  const handleRenameTeam = useCallback(
    (data: TTeamFormParams) => {
      if (team && isDirty) {
        dispatch(renameTeam({ ...data, teamId: team.id }));
      }
      if (team && hasBudgetManagementSetup && !isDirty) {
        dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamBudget, team, teamId: team.id }));
      }
    },
    [dispatch, team, isDirty, hasBudgetManagementSetup],
  );

  const handleCancel = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: null }));
  }, [dispatch]);

  useExternalErrors<TTeamFormParams>(setError, externalErrors);

  useEffect(() => {
    if (team) {
      reset({ [TeamField.Name]: team.name, [TeamField.GroupId]: team?.group?.id, [TeamField.GroupName]: '' });
    }
  }, [team, reset]);

  const onSubmit = team ? handleRenameTeam : handleCreateTeam;

  return (
    <Box component="form" sx={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={styles.content}>
        <Box>
          <Typography sx={styles.header}>Define the team name</Typography>
          <Divider color="divider" height={2} mt={1} mb={1} />
        </Box>
        <TeamName control={control} />
        <BillingGroup control={control} canCreateNewGroup={!team} />
        {isGroupNameVisible && <GroupName control={control} />}
      </Box>
      <StepSectionFooter
        cancelButton={
          <Button
            sx={styles.cancelButton}
            variant="outlined"
            disabled={isUpdating}
            onClick={handleCancel}
            data-testid="TeamInfoForm.Cancel"
          >
            Cancel
          </Button>
        }
        nextButton={
          <Button
            sx={styles.submitButton}
            type="submit"
            variant="contained"
            disabled={isUpdating}
            data-testid="TeamInfoForm.Next"
          >
            {hasBudgetManagementSetup ? 'Next' : 'Save'}
          </Button>
        }
      />
    </Box>
  );
};

export default memo(TeamInfoForm);
