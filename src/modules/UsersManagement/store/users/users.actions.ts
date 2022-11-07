import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IOffsetPagination, IRequestUser, IRequestUsersParams, IUser, IUsersMeta } from '../usersManagement.types';

const PREFIX = 'USERS_MANAGEMENT/USERS';

export const loadUsersRequest = createAction<IRequestUser>(`${PREFIX}/LOAD_USERS_REQUEST`);
export const loadUsersSuccess = createAction<{ data: IUser[]; pagination: IOffsetPagination; meta: IUsersMeta }>(
  `${PREFIX}/LOAD_USERS_SUCCESS`,
);
export const loadUsersFail = createAction<TErrors>(`${PREFIX}/LOAD_USERS_FAIL`);

export const resetUsers = createAction<void>(`${PREFIX}/RESET_USERS`);

export const setLastFilters = createAction<IRequestUsersParams>(`${PREFIX}/SET_LAST_FILTERS`);

export const refreshUsersRequest = createAction<void>(`${PREFIX}/REFRESH_USERS_REQUEST`);

export const setUserAsAdmin = createAction<number>(`${PREFIX}/SET_USER_AS_ADMIN`);
export const setUserAsMember = createAction<number>(`${PREFIX}/SET_USER_AS_MEMBER`);

export const setIsAllSelected = createAction<boolean>(`${PREFIX}/SET_IS_ALL_SELECTED`);
export const resetIsAllSelected = createAction(`${PREFIX}/RESET_IS_ALL_SELECTED`);

export const setPaginationLimit = createAction<number>(`${PREFIX}/SET_PAGINATION_LIMIT`);
