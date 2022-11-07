import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Theme, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useExternalErrors } from '@alycecom/hooks';
import { Divider } from '@alycecom/ui';
import { Features } from '@alycecom/modules';

import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { ITeam } from '../../../../store/teams/teams/teams.types';
import { createTeam, renameTeam } from '../../../../store/teams/team/team.actions';
import { getIsTeamLoading, getErrors } from '../../../../store/teams/team/team.selectors';
import { TeamField, TTeamFormParams } from '../../../../store/teams/team/team.types';
import { teamInfoFormDefaultValues, teamInfoFormResolver } from '../../../../store/teams/team/team.schemas';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';

import TeamName from './Fields/TeamName';
import BillingGroup from './Fields/BillingGroup';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    pt: 2,
  },
  content: {
    width: '100%',
    mt: 1,
    px: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'primary.main',
  },
  cancelButton: {
    width: 100,
    height: 48,
    borderRadius: 1,
    color: 'green.dark',
    border: ({ palette }: Theme) => `1px solid ${palette.green.dark}`,
    '&:hover': {
      borderColor: 'green.mountainMeadowLight',
    },
  },
  submitButton: {
    width: 100,
    height: 48,
    borderRadius: 1,
    color: 'common.white',
    backgroundColor: 'green.dark',
    '&:hover': {
      backgroundColor: 'green.mountainMeadowLight',
    },
  },
} as const;

export interface ITeamInfoFormProps {
  team?: ITeam;
}

const TeamInfoForm = ({ team }: ITeamInfoFormProps): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsTeamLoading);
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
  } = methods;

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

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
      reset({ [TeamField.Name]: team.name, [TeamField.GroupId]: team?.group?.id });
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
        <BillingGroup control={control} />
      </Box>
      <StepSectionFooter
        cancelButton={
          <Button sx={styles.cancelButton} variant="outlined" disabled={isLoading} onClick={handleCancel}>
            Cancel
          </Button>
        }
        nextButton={
          <Button sx={styles.submitButton} type="submit" variant="contained" disabled={isLoading}>
            {hasBudgetManagementSetup ? 'Next' : 'Save'}
          </Button>
        }
      />
    </Box>
  );
};

export default memo(TeamInfoForm);
