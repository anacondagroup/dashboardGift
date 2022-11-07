import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { IEmailNotificationsState } from './emailNotifications.reducer';

export const selectEmailNotificationsState = (state: IRootState): IEmailNotificationsState =>
  state.settings.personal.emailNotifications;

export const selectIsEmailNotificationsSettingsLoading = pipe(selectEmailNotificationsState, state => state.isLoading);

export const selectEmailNotificationsSettingsData = pipe(selectEmailNotificationsState, state => state.data);
export const selectIsAssistEnabled = pipe(selectEmailNotificationsSettingsData, state => state.assist);

export const selectIsIntegrationActive = pipe(selectEmailNotificationsState, state => state.integrations.active);
export const selectIsActiveIntegrationsLoading = pipe(
  selectEmailNotificationsState,
  state => state.integrations.isLoading,
);
