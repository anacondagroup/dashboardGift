import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ITeam, UserRoles } from '../usersManagement.types';

import { ICreateUsersParams, TUserCreateParams } from './usersCreate.types';

const PREFIX = 'USERS_MANAGEMENT/USERS_CREATE';

export const validateUserInfoRequest = createAction(
  `${PREFIX}/VALIDATE_USER_INFO_REQUEST`,
  (userInfo: TUserCreateParams, _: boolean) => userInfo,
  (_, shouldGoNextStep: boolean = false) => shouldGoNextStep,
);
export const validateUserInfoSuccess = createAction<void>(`${PREFIX}/VALIDATE_USER_INFO_SUCCESS`);
export const validateUserInfoFail = createAction<TErrors>(`${PREFIX}/VALIDATE_USER_INFO_FAIL`);

export const createUserRequest = createAction<ICreateUsersParams>();
export const createUserFail = createAction<TErrors>(`${PREFIX}/CREATE_USER_FAIL`);

export const setAssignRolesData = createAction<{ teams: ITeam[]; role: UserRoles }>(`${PREFIX}/SET_ASSIGN_ROLES_DATA`);

export const resetUsersCreateData = createAction<void>(`${PREFIX}/RESET_USERS_CREATE_DATA`);
