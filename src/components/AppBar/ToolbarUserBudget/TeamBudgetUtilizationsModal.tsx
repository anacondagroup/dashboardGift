import React, { memo } from 'react';
import { Button, GlobalFonts } from '@alycecom/ui';
import { Box, Modal, Theme, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TBudgetUtilization } from '@alycecom/services';

import { ITeam } from '../../../store/teams/teams.types';

import TeamUtilization from './TeamUtilization';

const styles = {
  budgetAllocationModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    width: 400,
    borderTop: ({ palette }: Theme) => `4px solid ${palette.green.mountainMeadowLight}`,
    borderRadius: '4px',
    padding: ({ spacing }: Theme) => spacing(2),
  },
  teamsContainer: {
    maxHeight: 400,
    overflow: 'scroll',
    padding: ({ spacing }: Theme) => spacing(1.5),
  },
  modalHeaderContainer: {
    marginBottom: ({ spacing }: Theme) => spacing(2),
  },
  modalHeader: GlobalFonts['.H3-Dark'],
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: ({ spacing }: Theme) => spacing(2),
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  okButton: {
    color: ({ palette }: Theme) => palette.common.white,
    backgroundColor: ({ palette }: Theme) => palette.green.dark,
    '&:hover': {
      backgroundColor: ({ palette }: Theme) => palette.green.mountainMeadowLight,
    },
  },
} as const;

interface ITeamBudgetUtilizationsModalProps {
  teams: ITeam[];
  budgetUtilizations: TBudgetUtilization[];
  showModal: boolean;
  toggleModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeamBudgetUtilizationsModal = ({
  teams,
  budgetUtilizations,
  showModal,
  toggleModalState,
}: ITeamBudgetUtilizationsModalProps) => (
  <Modal open={showModal} onBackdropClick={() => toggleModalState(false)} disableAutoFocus>
    <Box sx={styles.budgetAllocationModal}>
      <Box sx={styles.modalHeaderContainer}>
        <Typography sx={styles.modalHeader}>Your budget allocation</Typography>
        <CloseIcon sx={styles.closeIcon} color="action" onClick={() => toggleModalState(false)} />
      </Box>
      <Box sx={styles.teamsContainer}>
        {teams.map((team, index) => {
          const specificTeamUtilization: TBudgetUtilization | undefined = budgetUtilizations.find(
            utilization => utilization.teamId === team.id,
          );
          return (
            <TeamUtilization
              key={team.id}
              team={team}
              budgetUtilization={specificTeamUtilization}
              includeDivider={index !== teams.length - 1}
            />
          );
        })}
      </Box>
      <Box sx={styles.modalButtonContainer}>
        <Button variant="outlined" onClick={() => toggleModalState(false)} sx={styles.okButton}>
          OK
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default memo(TeamBudgetUtilizationsModal);
