import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Theme, Typography } from '@mui/material';
import { Divider, GlobalFonts, Icon, Tooltip } from '@alycecom/ui';
import { FormProvider, useForm } from 'react-hook-form';
import {
  BudgetType,
  MessageType,
  showGlobalMessage,
  TBudgetCreateParams,
  useCreateTeamBudgetMutation,
  useEditTeamBudgetMutation,
} from '@alycecom/services';

import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import {
  teamBudgetFormDefaultValues,
  teamBudgetFormResolver,
} from '../../../../store/teams/budgetCreate/budgetCreate.schemas';
import { getIsLoading } from '../../../../../UsersManagement/store/users/users.selectors';
import { TEAM_BUDGET_TOOLTIP_MESSAGE } from '../../../../constants/budget.constants';
import { getBudgetByTeamId } from '../../../../store/teams/budgets/budgets.selectors';
import { getTeamById, getTeams } from '../../../../store/teams/teams/teams.selectors';
import { loadBudgets } from '../../../../store/teams/budgets/budgets.actions';

import TeamBudget from './fields/TeamBudget';
import RefreshPeriodSelector from './fields/RefreshPeriod';
import BudgetTypeSelector from './fields/BudgetType';
import TeamMembersBudget from './TeamMembersBudget/TeamMembersBudget';
import PauseGiftingOn from './fields/PauseGiftingOn';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
    marginTop: ({ spacing }: Theme) => spacing(1),
    paddingX: ({ spacing }: Theme) => spacing(3),
  },
  budgetHeader: {
    display: 'flex',
  },
  header: GlobalFonts['.H4-Chambray'],
  cancelButton: {
    width: '100px',
    height: '48px',
    borderRadius: '8px',
    color: ({ palette }: Theme) => palette.green.dark,
    border: ({ palette }: Theme) => `1px solid ${palette.green.dark}`,
    '&:hover': {
      borderColor: ({ palette }: Theme) => palette.green.mountainMeadowLight,
    },
  },
  submitButton: {
    width: '100px',
    height: '48px',
    borderRadius: '8px',
    color: ({ palette }: Theme) => palette.common.white,
    backgroundColor: ({ palette }: Theme) => palette.green.dark,
    '&:hover': {
      backgroundColor: ({ palette }: Theme) => palette.green.mountainMeadowLight,
    },
  },
  formLine: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: ({ spacing }: Theme) => spacing(2),
  },
  inputLabel: {
    ...GlobalFonts['.Body-Regular-Left-Chambray'],
    alignSelf: 'center',
  },
  giftBudgetFieldsContainer: {
    display: 'flex',
    gap: 2,
  },
  tooltipIcon: {
    marginLeft: 0.5,
    color: 'primary.superLight',
  },
} as const;

interface ITeamBudgetFormProps {
  teamId: number;
}

const TeamBudgetForm = ({ teamId }: ITeamBudgetFormProps): JSX.Element => {
  const dispatch = useDispatch();
  const budget = useSelector(getBudgetByTeamId(teamId));

  const methods = useForm<TBudgetCreateParams>({
    mode: 'all',
    defaultValues: budget
      ? {
          amount: budget.amount,
          type: BudgetType.User,
          period: budget.period,
          pauseGiftingOn: budget.pauseGiftingOn,
          teamMembers: budget.teamMembers,
          notifyTeamAdminType: budget.notifyTeamAdminType,
          notifySenderType: budget.notifySenderType,
          notifySenderAtPercent: budget.notifySenderAtPercent,
          notifyTeamAdminAtPercent: budget.notifyTeamAdminAtPercent,
          rollover: budget.rollover,
        }
      : teamBudgetFormDefaultValues,
    resolver: teamBudgetFormResolver,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  const isUsersLoading = useSelector(getIsLoading);
  const team = useSelector(useMemo(() => getTeamById(teamId), [teamId]));
  const teams = useSelector(getTeams);

  const teamIds = teams.filter(item => item.archivedAt === null).map(item => item.id);

  const handleCancel = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: null }));
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo, team, teamId }));
  }, [dispatch, team, teamId]);

  const [
    createTeamBudget,
    { isLoading: isCreateBudgetLoading, isSuccess: isCreateSuccessfull, error: createBudgetError },
  ] = useCreateTeamBudgetMutation();
  const [
    setTeamBudget,
    { isLoading: isEditBudgetLoading, isSuccess: isEditSuccessfull, error: editBudgetError },
  ] = useEditTeamBudgetMutation();
  const isBudgetLoading = isEditBudgetLoading || isCreateBudgetLoading;

  const handleCreateBudget = useCallback(
    (data: TBudgetCreateParams) => {
      createTeamBudget({ teamId, body: data });
    },
    [createTeamBudget, teamId],
  );

  const handleEditBudget = useCallback(
    (data: TBudgetCreateParams) => {
      setTeamBudget({ teamId, body: data });
    },
    [setTeamBudget, teamId],
  );

  useEffect(() => {
    if (isCreateSuccessfull || isEditSuccessfull) {
      dispatch(setTeamSidebarStep({ step: null, teamId: undefined }));
      dispatch(loadBudgets({ teamIds }));
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamSettings, teamId }));
    }

    if (isCreateSuccessfull) {
      dispatch(
        showGlobalMessage({
          text: 'Success! You created a budget for your team.',
          type: MessageType.Success,
        }),
      );
    }

    if (isEditSuccessfull) {
      dispatch(
        showGlobalMessage({
          text: 'Update Saved Successfully!',
          type: MessageType.Success,
        }),
      );
    }
  }, [isCreateSuccessfull, isEditSuccessfull, teamIds, dispatch, teamId]);

  useEffect(() => {
    if (createBudgetError || editBudgetError) {
      dispatch(
        showGlobalMessage({
          text: 'Something went wrong. Please try again later.',
          type: MessageType.Error,
        }),
      );
    }
  }, [createBudgetError, editBudgetError, dispatch]);

  const onSubmit = budget ? handleEditBudget : handleCreateBudget;

  return (
    <FormProvider {...methods}>
      <Box component="form" sx={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={styles.content}>
          <Box sx={styles.budgetHeader}>
            <Typography sx={styles.header}>Give the team a budget</Typography>
            <Tooltip title={TEAM_BUDGET_TOOLTIP_MESSAGE}>
              <Icon icon="info-circle" sx={styles.tooltipIcon} />
            </Tooltip>
          </Box>
          <Divider color="divider" height={2} mt={1} mb={2} />
          <Grid container>
            <Grid container sx={styles.formLine}>
              <Grid item xs={4}>
                <Typography sx={styles.inputLabel}>Budget type</Typography>
              </Grid>
              <Grid item xs={8}>
                <BudgetTypeSelector control={control} error={errors.period?.message} />
              </Grid>
            </Grid>
            <Grid container sx={styles.formLine}>
              <Grid item xs={4}>
                <Typography sx={styles.inputLabel}>Gift Budget</Typography>
              </Grid>
              <Grid item xs={8}>
                <Box sx={styles.giftBudgetFieldsContainer}>
                  <TeamBudget control={control} error={errors.amount?.message} />
                  <RefreshPeriodSelector control={control} error={errors.period?.message} />
                </Box>
              </Grid>
            </Grid>
            <Grid container sx={styles.formLine}>
              <Grid item xs={4}>
                <Typography sx={styles.inputLabel}>Pause gifting when</Typography>
              </Grid>
              <Grid item xs>
                <PauseGiftingOn control={control} error={errors.period?.message} />
              </Grid>
            </Grid>
          </Grid>
          <TeamMembersBudget teamId={teamId} control={control} />
        </Box>

        <StepSectionFooter
          backButton={
            <Button startIcon={<Icon icon="arrow-left" />} onClick={handleBack} data-testid="TeamBudgetForm.Back">
              Back
            </Button>
          }
          cancelButton={
            <Button
              sx={styles.cancelButton}
              variant="outlined"
              disabled={isBudgetLoading}
              onClick={handleCancel}
              data-testid="TeamBudgetForm.Cancel"
            >
              Cancel
            </Button>
          }
          nextButton={
            <Button
              sx={styles.submitButton}
              type="submit"
              variant="contained"
              disabled={isBudgetLoading || isUsersLoading}
              data-testid="TeamBudgetForm.Save"
            >
              Next
            </Button>
          }
        />
      </Box>
    </FormProvider>
  );
};

export default memo(TeamBudgetForm);
