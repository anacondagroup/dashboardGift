import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TTeamSettingsData } from './teamSettings.types';
import {
  fetchTeamSettings,
  fetchTeamSettingsFail,
  fetchTeamSettingsSuccess,
  resetTeamSettings,
} from './teamSettings.actions';

export type TTeamSettingsState = {
  status: StateStatus;
  teamId: null | number;
  data: TTeamSettingsData;
};

export const initialState: TTeamSettingsState = {
  status: StateStatus.Idle,
  teamId: null,
  data: {
    restrictedProductsTypes: [],
    restrictedProductsVendors: [],
  },
};

export const teamSettings = createReducer<TTeamSettingsState>({}, initialState);

teamSettings.on(fetchTeamSettings, (state, payload) => ({
  ...state,
  teamId: payload.teamId,
  status: StateStatus.Pending,
}));

teamSettings.on(fetchTeamSettingsSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: payload,
}));

teamSettings.on(fetchTeamSettingsFail, state => ({
  ...state,
  teamId: null,
  status: StateStatus.Rejected,
}));

teamSettings.on(resetTeamSettings, () => initialState);
