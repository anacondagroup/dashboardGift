import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Typography } from '@mui/material';
import { Divider, Icon, SelectFilter } from '@alycecom/ui';

import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { getIsTeamUpdating } from '../../../../store/teams/team/team.selectors';
import {
  getAdminNotifyOption,
  getIsAdminNotify,
  getIsSenderNotify,
  getSenderNotifyOption,
} from '../../../../store/teams/notificationSettings/notificationSettings.selectors';
import {
  getNotificationSettings,
  setAdminNotifyOption,
  setIsAdminNotify,
  setIsSenderNotify,
  setSenderNotifyOption,
  updateNotificationSettings,
  cleanNotificationSettings,
} from '../../../../store/teams/notificationSettings/notificationSettings.actions';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import { notificationOptions } from '../../../../store/teams/notificationSettings/notificationSettings.types';

import { styles } from './TeamSettingsForm.styles';

interface ITeamSettingsFormProps {
  teamId?: number;
}

const TeamSettingsForm = ({ teamId }: ITeamSettingsFormProps): JSX.Element => {
  const dispatch = useDispatch();
  const isUpdating = useSelector(getIsTeamUpdating);
  const isAdminNotify = useSelector(getIsAdminNotify);
  const isSenderNotify = useSelector(getIsSenderNotify);
  const adminNotifyOption = useSelector(getAdminNotifyOption);
  const senderNotifyOption = useSelector(getSenderNotifyOption);

  useEffect(() => {
    if (teamId) {
      dispatch(getNotificationSettings(teamId));
    }

    return () => {
      dispatch(cleanNotificationSettings());
    };
  }, [dispatch, teamId]);

  const onSubmit = useCallback(() => {
    if (teamId) {
      dispatch(updateNotificationSettings(teamId));
    }
  }, [teamId, dispatch]);

  const handleBack = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamBudget, teamId }));
  }, [dispatch, teamId]);

  const handleClose = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: null }));
  }, [dispatch]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.content}>
        <Box>
          <Typography sx={styles.header}>Budget Spend Notification</Typography>
          <Divider color="divider" height={2} mt={1} mb={1} />
        </Box>
        <Box mb={3} display="flex">
          <FormControlLabel
            style={{ minWidth: 250 }}
            classes={{
              label: 'H4-Chambray',
            }}
            control={
              <Checkbox
                color="primary"
                checked={isAdminNotify}
                onChange={(_, checked) => dispatch(setIsAdminNotify(checked))}
                data-testid="TeamMembersBudgetTable.UserSelect.SelectAll2"
              />
            }
            label="Notify Team Admin"
          />
          <Box ml={4}>
            <SelectFilter
              name="adminNotifyOption"
              label="Select Notify option"
              value={adminNotifyOption}
              disabled={!isAdminNotify}
              style={{ minWidth: 210 }}
              dataTestId="CreateActivateCampaignStepper.SendAsId"
              onFilterChange={selectValue => dispatch(setAdminNotifyOption(selectValue.adminNotifyOption))}
              required
              renderItems={() =>
                Object.keys(notificationOptions).map((key: string) => (
                  <MenuItem key={key} value={key}>
                    {notificationOptions[key]?.title}
                  </MenuItem>
                ))
              }
            />
          </Box>
        </Box>
        <Box display="flex">
          <FormControlLabel
            style={{ minWidth: 250 }}
            classes={{
              label: 'H4-Chambray',
            }}
            control={
              <Checkbox
                color="primary"
                checked={isSenderNotify}
                onChange={(_, checked) => dispatch(setIsSenderNotify(checked))}
                data-testid="TeamMembersBudgetTable.UserSelect.SelectAll"
              />
            }
            label="Notify Sender"
          />
          <Box ml={4}>
            <SelectFilter
              name="senderNotifyOption"
              label="Select Notify option"
              style={{ minWidth: 210 }}
              value={senderNotifyOption}
              disabled={!isSenderNotify}
              dataTestId="CreateActivateCampaignStepper.SendAsId"
              onFilterChange={selectValue => dispatch(setSenderNotifyOption(selectValue.senderNotifyOption))}
              required
              renderItems={() =>
                Object.keys(notificationOptions).map((key: string) => (
                  <MenuItem key={key} value={key}>
                    {notificationOptions[key]?.title}
                  </MenuItem>
                ))
              }
            />
          </Box>
        </Box>
      </Box>
      <StepSectionFooter
        backButton={
          <Button startIcon={<Icon icon="arrow-left" />} onClick={handleBack} data-testid="TeamSettingsForm.Back">
            Back
          </Button>
        }
        cancelButton={
          <Button
            sx={styles.cancelButton}
            variant="outlined"
            disabled={isUpdating}
            onClick={handleClose}
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
            onClick={onSubmit}
          >
            Save
          </Button>
        }
      />
    </Box>
  );
};

export default memo(TeamSettingsForm);
