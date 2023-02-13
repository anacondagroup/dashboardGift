import React, { memo, useState, useMemo } from 'react';
import { LoadingLabel, Tooltip, Icon } from '@alycecom/ui';
import { Box, Typography } from '@mui/material';
import { TBudgetUtilization } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { sort, ascend, prop } from 'ramda';

import { getTeams } from '../../../store/teams/teams.selectors';
import { getBudgetUtilizationText } from '../../../helpers/budget.helpers';
import { getIsLoading } from '../../../modules/SettingsModule/store/teams/teams/teams.selectors';
import { ITeam } from '../../../store/teams/teams.types';

import TeamBudgetUtilizations from './TeamBudgetUtilizations';
import { styles } from './ToolbarUserBudget.styles';
import TeamBudgetUtilizationsModal from './TeamBudgetUtilizationsModal';

interface IToolbarUserBudgetProps {
  budgetUtilizations: TBudgetUtilization[];
  budgetUtilizationIsLoading: boolean;
}

const MAX_TEAM_NAME_LENGTH = 20;

const ToolbarUserBudget = ({
  budgetUtilizations,
  budgetUtilizationIsLoading,
}: IToolbarUserBudgetProps): JSX.Element => {
  const teams = useSelector(getTeams);
  const sortedTeams = useMemo(() => sort<ITeam>(ascend(prop('name')), teams), [teams]);

  const teamsIsLoading = useSelector(getIsLoading);

  const isLoading = budgetUtilizationIsLoading || teamsIsLoading;

  const [firstTeam] = sortedTeams;
  const firstTeamsUtilization = useMemo(
    () => budgetUtilizations.find(utilization => utilization.teamId === firstTeam?.id),
    [budgetUtilizations, firstTeam],
  );

  const shouldShowZeroBudgetWarning = firstTeamsUtilization && firstTeamsUtilization.availableBudgetAmount <= 0;
  const isTeamHasLongName = firstTeam?.name?.length > MAX_TEAM_NAME_LENGTH;
  const hasMoreThenOneTeam = sortedTeams.length > 1;

  const [showModal, toggleModalState] = useState<boolean>(false);
  const [isBudgetListVisible, setIsBudgetListVisible] = useState<boolean>(false);

  const { availableBudget, pendingGiftCosts } = getBudgetUtilizationText(firstTeamsUtilization);
  const activeTeams = sortedTeams.filter(team => team.archivedAt === null);

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <LoadingLabel />
        <LoadingLabel />
      </Box>
    );
  }

  return (
    <Tooltip
      sx={styles.tooltip}
      title={
        hasMoreThenOneTeam ? (
          <TeamBudgetUtilizations
            activeTeams={activeTeams}
            budgetUtilizations={budgetUtilizations}
            toggleModalState={toggleModalState}
          />
        ) : (
          ''
        )
      }
      arrow
      placement="bottom"
      onOpen={() => setIsBudgetListVisible(true)}
      onClose={() => {
        setIsBudgetListVisible(false);
        toggleModalState(false);
      }}
    >
      <Box sx={styles.container} data-testid="ToolbarUserBudget">
        <Box sx={styles.budgetsContainer}>
          <Box sx={styles.budgetLine}>
            <Typography sx={styles.text}>Available Budget</Typography>
            <Typography sx={styles.emphasizedText} data-testid="ToolbarUserBudget.AvailableBudget">
              {availableBudget}
            </Typography>
          </Box>
          <Box sx={styles.budgetLine}>
            <Typography sx={styles.text}>Pending gift costs</Typography>
            <Typography sx={styles.emphasizedText} data-testid="ToolbarUserBudget.PendingGiftCosts">
              {pendingGiftCosts}
            </Typography>
          </Box>
          <Box sx={styles.budgetLine}>
            <Tooltip title={isTeamHasLongName ? firstTeam.name : ''} arrow placement="top">
              <Typography sx={styles.teamName}>{firstTeam.name}</Typography>
            </Tooltip>
            {hasMoreThenOneTeam && <Icon sx={styles.icon} icon={isBudgetListVisible ? 'angle-down' : 'angle-up'} />}
          </Box>
        </Box>
        {shouldShowZeroBudgetWarning && (
          <Box sx={styles.warningDot} data-testid="ToolbarUserBudget.ZeroBudgetWarning" />
        )}
        <TeamBudgetUtilizationsModal
          teams={activeTeams}
          budgetUtilizations={budgetUtilizations}
          showModal={showModal}
          toggleModalState={toggleModalState}
        />
      </Box>
    </Tooltip>
  );
};

export default memo(ToolbarUserBudget);
