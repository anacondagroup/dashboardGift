import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToUsersState = (state: IRootState) => state.usersManagement.users;

export const getIsLoading = pipe(pathToUsersState, state => state.isLoading);

export const getIsLoaded = pipe(pathToUsersState, state => state.isLoaded);

export const getUsers = pipe(pathToUsersState, state => state.users);

export const getUsersMeta = pipe(pathToUsersState, state => state.usersMeta);

export const getPagination = pipe(pathToUsersState, state => state.pagination);

export const getLastFilters = pipe(pathToUsersState, state => state.lastFilters);

export const getIsAllSelected = pipe(pathToUsersState, state => state.lastFilters.isAllSelected);

export const getUsersError = pipe(pathToUsersState, state => state.errors);
