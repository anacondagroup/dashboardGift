import React, { memo, useState, useMemo } from 'react';
import { GlobalFonts, LoadingLabel, Tooltip } from '@alycecom/ui';
import { Box, Theme, Typography } from '@mui/material';
import { TBudgetUtilization } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { sort, ascend, prop } from 'ramda';

import { getTeams } from '../../../store/teams/teams.selectors';
import { getBudgetUtilizationText } from '../../../helpers/budget.helpers';
import { getIsLoading } from '../../../modules/SettingsModule/store/teams/teams/teams.selectors';
import { ITeam } from '../../../store/teams/teams.types';

import TeamBudgetUtilizations from './TeamBudgetUtilizations';

const styles = {
  container: {
    display: 'flex',
    margin: ({ spacing }: Theme) => spacing(0.5, 2, 3, 1),
  },
  noBudgetContainer: {
    marginRight: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  budgetsContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: ({ spacing }: Theme) => spacing(1),
    marginRight: ({ spacing }: Theme) => spacing(1),
  },
  budgetLine: {
    display: 'flex',
    maxWidth: 600,
    justifyContent: 'space-between',
    gap: ({ spacing }: Theme) => spacing(2),
  },
  text: GlobalFonts['.Body-Regular-Center-White'],
  emphasizedText: GlobalFonts['.Body-Regular-Center-White-Bold'],
  warningDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: ({ palette }: Theme) => palette.additional.red80,
    marginTop: ({ spacing }: Theme) => spacing(0.75),
    marginLeft: ({ spacing }: Theme) => spacing(0.75),
  },
  tooltip: {
    paddingTop: ({ spacing }: Theme) => spacing(0.5),
    '& .MuiTooltip-tooltip': {
      maxWidth: 400,
    },
  },
} as const;

interface IToolbarUserBudgetProps {
  budgetUtilizations: TBudgetUtilization[];
  budgetUtilizationIsLoading: boolean;
}

const ToolbarUserBudget = ({
  budgetUtilizations,
  budgetUtilizationIsLoading,
}: IToolbarUserBudgetProps): JSX.Element => {
  const teams = useSelector(getTeams);
  const sortedTeams = useMemo(() => sort<ITeam>(ascend(prop('name')), teams), [teams]);

  const teamsIsLoading = useSelector(getIsLoading);

  const isLoading = budgetUtilizationIsLoading || teamsIsLoading;

  const firstTeamsUtilization = budgetUtilizations.find(utilization => utilization.teamId === sortedTeams[0].id);

  const shouldShowZeroBudgetWarning = firstTeamsUtilization && firstTeamsUtilization.availableBudgetAmount === 0;

  const [showModal, toggleModalState] = useState<boolean>(false);

  const { availableBudget, pendingGiftCosts } = getBudgetUtilizationText(firstTeamsUtilization);

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
        <TeamBudgetUtilizations
          teams={sortedTeams}
          budgetUtilizations={budgetUtilizations}
          showModal={showModal}
          toggleModalState={toggleModalState}
        />
      }
      arrow
      placement="bottom"
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
        </Box>
        {shouldShowZeroBudgetWarning && (
          <Box sx={styles.warningDot} data-testid="ToolbarUserBudget.ZeroBudgetWarning" />
        )}
      </Box>
    </Tooltip>
  );
};
export default memo(ToolbarUserBudget);
