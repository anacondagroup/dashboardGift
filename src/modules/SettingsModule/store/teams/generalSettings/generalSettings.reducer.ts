import { createReducer } from 'redux-act';

import * as actions from './generalSettings.actions';

export interface IGeneralSettingsState {
  isLoading: boolean;
  isLoaded: boolean;
  teamId: number | null;
  teamName: string;
  countryId: number | null;
  outerUnsubscribeUrl: string | null;
  teamOwnerName: string;
  blockReminder: boolean;
  giftExpireInDays: number | null;
  requireEmailIntegration: boolean | string;
  canOverrideGiftExpireInDaysSetting: boolean;
  nameUsageInEmails: string;
  complianceIsRequired: boolean;
  complianceRevertText: string | null;
  complianceLink: string | null;
  compliancePromptText: string | null;
  blockReminders: boolean | null;
  errors: Record<string, unknown>;
}

export const initialState: IGeneralSettingsState = {
  isLoading: false,
  isLoaded: false,
  teamId: null,
  teamName: '',
  countryId: null,
  outerUnsubscribeUrl: '',
  teamOwnerName: '',
  blockReminder: false,
  giftExpireInDays: null,
  requireEmailIntegration: false,
  canOverrideGiftExpireInDaysSetting: false,
  nameUsageInEmails: '',
  complianceIsRequired: false,
  complianceRevertText: '',
  complianceLink: '',
  compliancePromptText: null,
  blockReminders: null,
  errors: {},
};

export const reducer = createReducer({}, initialState);

reducer.on(actions.getSettings, (state, payload) => ({
  ...state,
  teamId: payload,
  isLoading: true,
  isLoaded: false,
}));
reducer.on(actions.getSettingsSuccess, (state, payload) => ({
  ...state,
  ...payload,
  isLoading: false,
  isLoaded: true,
}));
reducer.on(actions.getSettingsFail, state => ({
  ...state,
  isLoading: false,
  isLoaded: false,
}));

reducer.on(actions.updateSettings, state => ({
  ...state,
  isLoading: true,
  errors: {},
}));
reducer.on(actions.updateSettingsSuccess, (state, payload) => ({
  ...state,
  ...payload,
  isLoading: false,
}));
reducer.on(actions.updateSettingsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));
