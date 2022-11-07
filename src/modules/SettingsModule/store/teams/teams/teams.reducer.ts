import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import {
  loadTeamsSettingsRequest,
  loadTeamsSettingsSuccess,
  loadTeamsSettingsFail,
  clearTeamsSetting,
} from './teams.actions';
import { ITeam } from './teams.types';

export const teamsAdapter = createEntityAdapter<ITeam>();

export const initialTeamsState = teamsAdapter.getInitialState({
  status: StateStatus.Idle,
  errors: false,
});

export type TTeamsState = typeof initialTeamsState;

export const teams = createReducer({}, initialTeamsState);

teams.on(loadTeamsSettingsRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
teams.on(loadTeamsSettingsSuccess, (state, payload) => ({
  ...state,
  ...teamsAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));
teams.on(loadTeamsSettingsFail, (state, payload) => ({
  ...state,
  status: StateStatus.Rejected,
  errors: payload,
}));

teams.on(clearTeamsSetting, () => ({
  ...initialTeamsState,
}));
