import { createReducer } from 'redux-act';

import { ITeam } from './teams.types';
import { loadTeamsFail, loadTeamsRequest, loadTeamsSuccess } from './teams.actions';

export interface ITeamsState {
  teams: ITeam[];
  isLoading: boolean;
  isLoaded: boolean;
}

export const initialState: ITeamsState = {
  teams: [],
  isLoading: false,
  isLoaded: false,
};

export default createReducer({}, initialState)
  .on(loadTeamsRequest, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  }))
  .on(loadTeamsSuccess, (state, payload) => ({
    ...initialState,
    isLoading: false,
    isLoaded: true,
    teams: payload,
  }))
  .on(loadTeamsFail, () => ({
    ...initialState,
    isLoading: false,
    isLoaded: true,
  }));
