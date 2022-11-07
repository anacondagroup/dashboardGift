import React, { memo } from 'react';
import { GlobalFonts } from '@alycecom/ui';
import { Box, Theme, Typography } from '@mui/material';
import { TBudgetUtilization } from '@alycecom/services';

import { ITeam } from '../../../store/teams/teams.types';

import TeamUtilization from './TeamUtilization';
import TeamBudgetUtilizationsModal from './TeamBudgetUtilizationsModal';

const styles = {
  divider: {
    marginY: ({ spacing }: Theme) => spacing(1),
  },
  showAllText: {
    ...GlobalFonts['.Body-Regular-Center-Link-Bold'],
    cursor: 'pointer',
  },
} as const;

interface ITeamBudgetUtilizations {
  teams: ITeam[];
  budgetUtilizations: TBudgetUtilization[];
  showModal: boolean;
  toggleModalState: React.Dispatch<React.SetStateAction<boolean>>;
}
const TeamBudgetUtilizations = ({
  teams,
  budgetUtilizations,
  showModal,
  toggleModalState,
}: ITeamBudgetUtilizations) => {
  const firstThreeTeams = teams.slice(0, 3);

  return (
    <Box>
      {firstThreeTeams.map((team, index) => {
        const specificTeamUtilization: TBudgetUtilization | undefined = budgetUtilizations.find(
          utilization => utilization.teamId === team.id,
        );

        return (
          <TeamUtilization
            key={team.id}
            team={team}
            budgetUtilization={specificTeamUtilization}
            includeDivider={index !== firstThreeTeams.length - 1}
          />
        );
      })}
      {teams.length > 3 && (
        <Typography sx={styles.showAllText} onClick={() => toggleModalState(true)}>
          Show All
        </Typography>
      )}
      <TeamBudgetUtilizationsModal
        teams={teams}
        budgetUtilizations={budgetUtilizations}
        showModal={showModal}
        toggleModalState={toggleModalState}
      />
    </Box>
  );
};

export default memo(TeamBudgetUtilizations);
