import React, { memo, useEffect } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage, AlyceTheme } from '@alycecom/ui';
import { useSelector, useDispatch, batch } from 'react-redux';
import { MessageType, showGlobalMessage, useArchiveTeamByIdMutation } from '@alycecom/services';

import {
  getIsArchiveTeamModalOpen,
  getSelectedTeamId,
} from '../../../../../store/ui/teamsManagement/teamsManagement.selectors';
import { resetState } from '../../../../../store/ui/teamsManagement';
import { loadTeamsSettingsRequest } from '../../../../../store/teams/teams/teams.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  root: {
    width: 500,
    borderTop: `4px solid ${palette.secondary.main}`,
  },
  avatar: {
    backgroundColor: palette.secondary.main,
  },
  submitButton: {
    backgroundColor: palette.secondary.main,
  },
}));
type TArchiveTeamConfirmation = {
  includeArchived?: boolean;
};

const ArchiveTeamConfirmation = ({ includeArchived }: TArchiveTeamConfirmation): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isOpen = useSelector(getIsArchiveTeamModalOpen);
  const selectedTeamId = useSelector(getSelectedTeamId);

  const [archiveTeamById, { isLoading, isSuccess }] = useArchiveTeamByIdMutation();

  const handleSubmit = () => {
    if (selectedTeamId) {
      archiveTeamById(selectedTeamId);
    }
  };

  const handleDiscard = () => {
    dispatch(resetState());
  };

  useEffect(() => {
    if (isSuccess) {
      batch(() => {
        dispatch(
          showGlobalMessage({
            type: MessageType.Success,
            text: 'Team has been archived',
          }),
        );
        dispatch(resetState());
        dispatch(loadTeamsSettingsRequest({ includeArchived }));
      });
    }
  }, [dispatch, isSuccess, includeArchived]);

  return (
    <ModalConfirmationMessage
      title="Archive team"
      icon="question-circle"
      submitButtonText="Archive"
      cancelButtonText="Cancel"
      width="100%"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
      customClasses={classes}
      isLoading={isLoading}
    >
      <Typography>
        Once archived, the gifts will be expired, active campaigns will be expired and team data will be excluded from
        reporting.
      </Typography>
    </ModalConfirmationMessage>
  );
};

export default memo(ArchiveTeamConfirmation);
