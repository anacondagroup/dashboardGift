import { createReducer } from 'redux-act';

import { loadSwagTeamsFail, loadSwagTeamsRequest, loadSwagTeamsSuccess } from './swagTeams.actions';
import { ITeamMember } from './swagTeams.types';

export interface ISwagTeamsState {
  teams: ITeamMember[];
  isLoading: boolean;
}

export const initialSwagTeamsState: ISwagTeamsState = {
  teams: [],
  isLoading: false,
};

export default createReducer({}, initialSwagTeamsState)
  .on(loadSwagTeamsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadSwagTeamsSuccess, (state, payload) => ({
    ...state,
    teams: payload.teams,
    isLoading: false,
  }))
  .on(loadSwagTeamsFail, state => ({
    ...state,
    isLoading: false,
  }));
