import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { ITeamExtraData } from '../../usersManagement.types';

import { loadTeamsRequest, loadTeamsSuccess, loadTeamsFail } from './teams.actions';

export const teamsAdapter = createEntityAdapter<ITeamExtraData>();

export const initialState = teamsAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TTeamsState = typeof initialState;

export const teams = createReducer({}, initialState);

teams
  .on(loadTeamsRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(loadTeamsSuccess, (state, payload) => ({
    ...state,
    ...teamsAdapter.setAll(payload, state),
    status: StateStatus.Fulfilled,
  }))
  .on(loadTeamsFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
