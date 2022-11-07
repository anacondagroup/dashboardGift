import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { createTeam, renameTeam, resetTeamData } from './team.actions';

export type TTeamState = {
  status: StateStatus;
  errors: TErrors;
};

export const initialTeamState: TTeamState = {
  status: StateStatus.Idle,
  errors: {},
};

export const reducer = createReducer({}, initialTeamState);

reducer
  .on(createTeam.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(createTeam.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(createTeam.rejected, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))
  .on(renameTeam.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(renameTeam.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(renameTeam.rejected, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))
  .on(resetTeamData, () => initialTeamState);
