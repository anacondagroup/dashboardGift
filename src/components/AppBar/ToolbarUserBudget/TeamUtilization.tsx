import React, { memo } from 'react';
import { GlobalFonts } from '@alycecom/ui';
import { Box, Divider, Theme, Typography } from '@mui/material';
import { TBudgetUtilization } from '@alycecom/services';

import { ITeam } from '../../../store/teams/teams.types';
import { getBudgetUtilizationText } from '../../../helpers/budget.helpers';

const styles = {
  teamBudgetContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  text: GlobalFonts['.Body-Regular-Left-Chambray'],
  emphasizedText: GlobalFonts['.Body-Regular-Left-Chambray-Bold'],
  budgetLine: {
    display: 'flex',
    maxWidth: 600,
    justifyContent: 'space-between',
    gap: ({ spacing }: Theme) => spacing(2),
  },
  divider: {
    marginY: ({ spacing }: Theme) => spacing(1),
  },
} as const;

interface ITeamUtilizationProps {
  team: ITeam;
  budgetUtilization: TBudgetUtilization | undefined;
  includeDivider: boolean;
}
const TeamUtilization = ({ team, budgetUtilization, includeDivider }: ITeamUtilizationProps): JSX.Element => {
  const { availableBudget, pendingGiftCosts, allocatedBudget } = getBudgetUtilizationText(budgetUtilization);

  return (
    <Box sx={styles.teamBudgetContainer}>
      <Typography sx={styles.emphasizedText}>{team.name}</Typography>
      <Box sx={styles.budgetLine}>
        <Typography sx={styles.text}>Available budget</Typography>
        <Typography sx={styles.emphasizedText}>{availableBudget}</Typography>
      </Box>
      <Box sx={styles.budgetLine}>
        <Typography sx={styles.text}>Pending gift costs</Typography>
        <Typography sx={styles.emphasizedText}>{pendingGiftCosts}</Typography>
      </Box>
      <Box sx={styles.budgetLine}>
        <Typography sx={styles.text}>Allocated budget</Typography>
        <Typography sx={styles.emphasizedText}>{allocatedBudget}</Typography>
      </Box>
      {includeDivider && <Divider sx={styles.divider} />}
    </Box>
  );
};

export default memo(TeamUtilization);
