import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { update } from 'ramda';

import { IOffsetPagination, IRequestUsersParams, IUser, IUsersMeta, UserRoles } from '../usersManagement.types';
import { TABLE_SORT } from '../../../../components/Shared/CustomTable/customTable.constants';

import {
  loadUsersRequest,
  loadUsersSuccess,
  loadUsersFail,
  resetUsers,
  setLastFilters,
  setUserAsAdmin,
  setUserAsMember,
  setIsAllSelected,
  resetIsAllSelected,
  setPaginationLimit,
} from './users.actions';
import { USERS_DEFAULT_PAGE_LIMIT } from './users.constants';

export interface IUsersState {
  isLoading: boolean;
  isLoaded: boolean;
  users: IUser[];
  usersMeta: IUsersMeta;
  pagination: IOffsetPagination;
  lastFilters: IRequestUsersParams;
  errors: TErrors;
}

export const initialState: IUsersState = {
  isLoading: false,
  isLoaded: false,
  users: [],
  usersMeta: {
    pendingInvitationUsers: [],
  },
  pagination: {
    offset: 0,
    limit: USERS_DEFAULT_PAGE_LIMIT,
    total: 0,
  },
  lastFilters: {
    search: '',
    teamId: null,
    pendingInvitation: false,
    sortField: 'name',
    sortDirection: TABLE_SORT.ASC,
    currentPage: 1,
    limit: USERS_DEFAULT_PAGE_LIMIT,
    isAllSelected: false,
  },
  errors: {},
};

export const users = createReducer<IUsersState>({}, initialState);

users
  .on(loadUsersRequest, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  }))
  .on(loadUsersSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    users: payload.data,
    usersMeta: payload.meta,
    pagination: payload.pagination,
  }))
  .on(loadUsersFail, (state, payload) => ({
    ...state,
    isLoading: false,
    errors: payload,
  }));

users.on(setLastFilters, (state, payload) => ({
  ...state,
  lastFilters: payload,
}));

users.on(resetUsers, state => ({
  ...state,
  ...initialState,
}));

users.on(setUserAsAdmin, (state, payload) => {
  const userIndex = state.users.findIndex(user => user.id === payload);
  const user = state.users[userIndex];
  const updatedUser = {
    ...user,
    teams: user.teams.map(team => ({ ...team, access: UserRoles.admin })),
  };
  return {
    ...state,
    users: update(userIndex, updatedUser, state.users),
  };
});

users.on(setUserAsMember, (state, payload) => {
  const userIndex = state.users.findIndex(user => user.id === payload);
  const user = state.users[userIndex];
  const updatedUser = {
    ...user,
    teams: user.teams.map(team => ({ ...team, access: UserRoles.member })),
  };
  return {
    ...state,
    users: update(userIndex, updatedUser, state.users),
  };
});

users.on(setIsAllSelected, (state, payload) => ({
  ...state,
  lastFilters: {
    ...state.lastFilters,
    isAllSelected: payload,
  },
}));

users.on(resetIsAllSelected, state => ({
  ...state,
  lastFilters: {
    ...state.lastFilters,
    isAllSelected: false,
  },
}));

users.on(setPaginationLimit, (state, payload) => ({
  ...state,
  pagination: {
    ...state.pagination,
    limit: payload,
  },
}));
