import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import {
  loadEmailNotificationsSettingsRequest,
  loadEmailNotificationsSettingsSuccess,
  loadEmailNotificationsSettingsFail,
  updateEmailNotificationsSettingsRequest,
  updateEmailNotificationsSettingsSuccess,
  updateEmailNotificationsSettingsFail,
  setEmailNotificationsSettings,
  loadActiveIntegrationsRequest,
  loadActiveIntegrationsSuccess,
  loadActiveIntegrationsFail,
} from './emailNotifications.actions';
import { IEmailNotificationsSettings } from './emailNotifications.types';

export interface IEmailNotificationsState {
  isLoading: boolean;
  integrations: {
    isLoading: boolean;
    active: boolean;
  };
  data: IEmailNotificationsSettings;
  errors?: TErrors;
}

export const initialState: IEmailNotificationsState = {
  isLoading: false,
  integrations: {
    isLoading: false,
    active: false,
  },
  data: {
    assist: false,
  },
  errors: undefined,
};

const reducer = createReducer({}, initialState);

reducer.on(loadActiveIntegrationsRequest, state => ({
  ...state,
  integrations: {
    ...state.integrations,
    isLoading: true,
  },
}));
reducer.on(loadActiveIntegrationsSuccess, (state, payload) => ({
  ...state,
  integrations: {
    ...state.integrations,
    isLoading: false,
    active: payload.active,
  },
}));
reducer.on(loadActiveIntegrationsFail, state => ({
  ...state,
  integrations: {
    isLoading: false,
    active: false,
  },
}));

reducer.on(loadEmailNotificationsSettingsRequest, state => ({
  ...state,
  isLoading: true,
  errors: undefined,
}));
reducer.on(loadEmailNotificationsSettingsSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  data: payload,
}));
reducer.on(loadEmailNotificationsSettingsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(setEmailNotificationsSettings, (state, payload) => ({
  ...state,
  data: {
    ...state.data,
    ...payload,
  },
}));

reducer.on(updateEmailNotificationsSettingsRequest, state => ({
  ...state,
  isLoading: true,
  errors: undefined,
}));
reducer.on(updateEmailNotificationsSettingsSuccess, state => ({
  ...state,
  isLoading: false,
}));
reducer.on(updateEmailNotificationsSettingsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

export { reducer };
