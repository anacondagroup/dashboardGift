import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToUsersState = (state: IRootState) => state.usersManagement.usersCreate;

export const getIsCreatePending = pipe(pathToUsersState, state => state.isCreatePending);
export const getUserTeams = pipe(pathToUsersState, state => state.teams);
export const getRole = pipe(pathToUsersState, state => state.role);
export const getErrors = pipe(pathToUsersState, state => state.errors);
export const getExistUserId = pipe(pathToUsersState, state => state.existUserId);
