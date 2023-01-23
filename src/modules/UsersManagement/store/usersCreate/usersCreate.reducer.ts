import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ITeam, UserRoles } from '../usersManagement.types';

import {
  validateUserInfoRequest,
  validateUserInfoSuccess,
  validateUserInfoFail,
  createUserRequest,
  createUserFail,
  resetUsersCreateData,
  setAssignRolesData,
  clearExistUser,
} from './usersCreate.actions';

export interface IUsersCreateState {
  isCreatePending: boolean;
  teams: ITeam[];
  role: UserRoles;
  errors: TErrors;
  existUserId?: number;
}

export const initialState: IUsersCreateState = {
  isCreatePending: false,
  teams: [],
  role: UserRoles.member,
  errors: {},
  existUserId: undefined,
};

export const usersCreate = createReducer<IUsersCreateState>({}, initialState);

usersCreate
  .on(validateUserInfoRequest, state => ({
    ...state,
    isCreatePending: true,
    errors: {},
  }))
  .on(validateUserInfoSuccess, state => ({
    ...state,
    isCreatePending: false,
  }))
  .on(clearExistUser, state => ({
    ...state,
    existUserId: undefined,
  }))
  .on(validateUserInfoFail, (state, payload, userId) => ({
    ...state,
    isCreatePending: false,
    existUserId: userId,
    errors: payload,
  }));

usersCreate
  .on(createUserRequest, state => ({
    ...state,
    isCreatePending: true,
  }))
  .on(createUserFail, (state, payload) => ({
    ...state,
    isCreatePending: false,
    errors: payload,
  }));

usersCreate.on(setAssignRolesData, (state, payload) => ({
  ...state,
  teams: payload.teams,
  role: payload.role,
}));

usersCreate.on(resetUsersCreateData, () => initialState);
