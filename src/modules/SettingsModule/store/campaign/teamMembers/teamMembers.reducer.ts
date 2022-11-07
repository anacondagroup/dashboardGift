import { createReducer } from 'redux-act';

import {
  loadTeamMembersRequest,
  loadTeamMembersSuccess,
  loadTeamMembersFail,
  loadTeamAdminsRequest,
  loadTeamAdminsSuccess,
  loadTeamAdminsFail,
  clearData,
} from './teamMembers.actions';
import { ITeamMember } from './teamMembers.types';

export interface ITeamMembersState {
  members: ITeamMember[];
  admins?: ITeamMember[];
  isLoading: boolean;
}

export const initialTeamMembersState: ITeamMembersState = {
  members: [],
  admins: undefined,
  isLoading: false,
};

export const teamMembers = createReducer({}, initialTeamMembersState)
  .on(loadTeamMembersRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadTeamMembersSuccess, (state, payload) => ({
    ...state,
    members: payload.members,
    isLoading: false,
  }))
  .on(loadTeamMembersFail, state => ({
    ...state,
    isLoading: false,
  }))

  .on(loadTeamAdminsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadTeamAdminsSuccess, (state, payload) => ({
    ...state,
    admins: payload.admins,
    isLoading: false,
  }))
  .on(loadTeamAdminsFail, state => ({
    ...state,
    isLoading: false,
  }))

  .on(clearData, () => ({
    ...initialTeamMembersState,
  }));
