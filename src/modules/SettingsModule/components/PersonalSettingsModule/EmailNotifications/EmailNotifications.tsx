import React, { useCallback, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { ActionButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import {
  selectIsEmailNotificationsSettingsLoading,
  selectIsAssistEnabled,
  selectIsActiveIntegrationsLoading,
  selectIsIntegrationActive,
} from '../../../store/personal/emailNotifications/emailNotificatons.selectors';
import {
  updateEmailNotificationsSettingsRequest,
  loadEmailNotificationsSettingsRequest,
  setEmailNotificationsSettings,
  loadActiveIntegrationsRequest,
} from '../../../store/personal/emailNotifications/emailNotifications.actions';

import AssistEmailSettings, { TOnAssistSettingsChange } from './AssistEmailSettings';

const EmailNotifications = (): JSX.Element => {
  const dispatch = useDispatch();

  const isSettingsLoading = useSelector(selectIsEmailNotificationsSettingsLoading);
  const isAssistEnabled = useSelector(selectIsAssistEnabled);
  const isActiveIntegrationsLoading = useSelector(selectIsActiveIntegrationsLoading);
  const isIntegrationActive = useSelector(selectIsIntegrationActive);

  const isLoading = isSettingsLoading || isActiveIntegrationsLoading;

  const onAssistSettingsChanged: TOnAssistSettingsChange = useCallback(
    (isEnabled: boolean) => {
      dispatch(setEmailNotificationsSettings({ assist: isEnabled }));
    },
    [dispatch],
  );

  const saveEmailNotificationsSettings = useCallback(() => {
    dispatch(updateEmailNotificationsSettingsRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadActiveIntegrationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isIntegrationActive) {
      dispatch(loadEmailNotificationsSettingsRequest());
    }
  }, [dispatch, isIntegrationActive]);

  return (
    <DashboardLayout>
      <Paper elevation={1}>
        <Box p={4}>
          <AssistEmailSettings
            isAssistEnabled={isAssistEnabled}
            onChange={onAssistSettingsChanged}
            disabled={!isIntegrationActive}
          />
          <Box mt={3}>
            <ActionButton onClick={saveEmailNotificationsSettings} disabled={isLoading || !isIntegrationActive}>
              Save
            </ActionButton>
          </Box>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default React.memo(EmailNotifications);
