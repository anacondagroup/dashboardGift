import { createReducer } from 'redux-act';

import { loadSwagTeamAdminsFail, loadSwagTeamAdminsRequest, loadSwagTeamAdminsSuccess } from './swagTeamAdmins.actions';
import { ITeamMember } from './swagTeamAdmins.types';

export interface ISwagTeamAdminsState {
  admins: ITeamMember[];
  isLoading: boolean;
}

export const initialSwagTeamAdminsState: ISwagTeamAdminsState = {
  admins: [],
  isLoading: false,
};

export default createReducer({}, initialSwagTeamAdminsState)
  .on(loadSwagTeamAdminsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadSwagTeamAdminsSuccess, (state, payload) => ({
    ...state,
    admins: payload.admins,
    isLoading: false,
  }))
  .on(loadSwagTeamAdminsFail, state => ({
    ...state,
    isLoading: false,
  }));
