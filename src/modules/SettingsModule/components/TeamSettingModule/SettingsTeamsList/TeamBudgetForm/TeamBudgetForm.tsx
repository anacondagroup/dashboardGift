import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Theme, Typography } from '@mui/material';
import { Divider, GlobalFonts, Icon, Tooltip } from '@alycecom/ui';
import { useForm } from 'react-hook-form';
import { useExternalErrors } from '@alycecom/hooks';

import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import {
  BudgetCreateField,
  BudgetType,
  ITeamMemberBudget,
  PauseGiftingOnOption,
  TBudgetCreateParams,
} from '../../../../store/teams/budgetCreate/budgetCreate.types';
import {
  teamBudgetFormDefaultValues,
  teamBudgetFormResolver,
} from '../../../../store/teams/budgetCreate/budgetCreate.schemas';
import { getIsBudgetCreateLoading, getErrors } from '../../../../store/teams/budgetCreate/budgetCreate.selectors';
import { getIsLoading } from '../../../../../UsersManagement/store/users/users.selectors';
import { createBudget, editBudget } from '../../../../store/teams/budgetCreate/budgetCreate.actions';
import { TEAM_BUDGET_TOOLTIP_MESSAGE } from '../../../../constants/budget.constants';
import { getBudgetByTeamId } from '../../../../store/teams/budgets/budgets.selectors';
import { getTeamById } from '../../../../store/teams/teams/teams.selectors';

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
  const budget = useSelector(useMemo(() => getBudgetByTeamId(teamId), [teamId]));

  const methods = useForm<TBudgetCreateParams>({
    mode: 'all',
    defaultValues: budget
      ? {
          amount: budget.amount,
          type: BudgetType.User,
          period: budget.period,
          pauseGiftingOn: PauseGiftingOnOption.Claimed,
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
    setError,
    control,
    setValue,
    watch,
    reset,
  } = methods;

  const isLoading = useSelector(getIsBudgetCreateLoading);
  const isUsersLoading = useSelector(getIsLoading);
  const externalErrors = useSelector(getErrors);
  const teamBudgets: ITeamMemberBudget[] = watch('teamMembers');
  const sumOfMemberBudgets = teamBudgets.reduce((prev, curr) => prev + curr.budget, 0);
  const team = useSelector(getTeamById(teamId));

  const refreshPeriod = watch('period');

  const handleCancel = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: null }));
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo, team, teamId }));
  }, [dispatch, team, teamId]);

  const handleCreateBudget = useCallback(
    (data: TBudgetCreateParams) => {
      dispatch(createBudget({ data, teamId }));
    },
    [dispatch, teamId],
  );

  const handleEditBudget = useCallback(
    (data: TBudgetCreateParams) => {
      dispatch(editBudget({ data, teamId }));
    },
    [dispatch, teamId],
  );

  const onMemberBudgetDefinition = useCallback(() => {
    const totalBudget = teamBudgets.reduce((prev, curr) => prev + curr.budget, 0);

    setValue(BudgetCreateField.Amount, totalBudget);
  }, [setValue, teamBudgets]);

  useExternalErrors<TBudgetCreateParams>(setError, externalErrors);

  const onSubmit = budget ? handleEditBudget : handleCreateBudget;

  useEffect(() => reset(), [reset]);

  return (
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
        <TeamMembersBudget
          teamId={teamId}
          control={control}
          refreshPeriod={refreshPeriod}
          onMemberBudgetDefinition={onMemberBudgetDefinition}
          memberBudgetsTotal={sumOfMemberBudgets}
          existingBudget={budget}
        />
      </Box>

      <StepSectionFooter
        backButton={
          <Button startIcon={<Icon icon="arrow-left" />} onClick={handleBack}>
            Back
          </Button>
        }
        cancelButton={
          <Button sx={styles.cancelButton} variant="outlined" disabled={isLoading} onClick={handleCancel}>
            Cancel
          </Button>
        }
        nextButton={
          <Button sx={styles.submitButton} type="submit" variant="contained" disabled={isLoading || isUsersLoading}>
            Save
          </Button>
        }
      />
    </Box>
  );
};

export default memo(TeamBudgetForm);
