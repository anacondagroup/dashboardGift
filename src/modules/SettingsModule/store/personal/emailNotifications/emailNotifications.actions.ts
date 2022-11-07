import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IEmailNotificationsSettings } from './emailNotifications.types';

const PREFIX = 'PERSONAL_SETTINGS/EMAIL_NOTIFICATIONS';

export const loadActiveIntegrationsRequest = createAction(`${PREFIX}/LOAD_ACTIVE_INTEGRATIONS_REQUEST`);
export const loadActiveIntegrationsSuccess = createAction<{ active: boolean }>(
  `${PREFIX}/LOAD_ACTIVE_INTEGRATIONS_SUCCESS`,
);
export const loadActiveIntegrationsFail = createAction(`${PREFIX}/LOAD_ACTIVE_INTEGRATIONS_FAIL`);

export const loadEmailNotificationsSettingsRequest = createAction(`${PREFIX}/LOAD_SETTINGS_REQUEST`);
export const loadEmailNotificationsSettingsSuccess = createAction<IEmailNotificationsSettings>(
  `${PREFIX}/LOAD_SETTINGS_SUCCESS`,
);
export const loadEmailNotificationsSettingsFail = createAction<TErrors>(`${PREFIX}/LOAD_SETTINGS_FAIL`);

export const setEmailNotificationsSettings = createAction<IEmailNotificationsSettings>(`${PREFIX}/SET_SETTINGS`);

export const updateEmailNotificationsSettingsRequest = createAction(`${PREFIX}/UPDATE_SETTINGS_REQUEST`);
export const updateEmailNotificationsSettingsSuccess = createAction(`${PREFIX}/UPDATE_SETTINGS_SUCCESS`);
export const updateEmailNotificationsSettingsFail = createAction<TErrors>(`${PREFIX}/UPDATE_SETTINGS_FAIL`);
