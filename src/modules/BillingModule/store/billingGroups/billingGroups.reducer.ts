import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { StateStatus } from '../../../../store/stateStatuses.types';

import { IBillingGroupsInfo, IBillingGroup } from './billingGroups.types';
import {
  getGroupsListRequest,
  getGroupsListSuccess,
  getGroupsListFail,
  resetBillingGroupsResult,
  setBillingGroupsCurrentPage,
  getTeamsListRequest,
  getTeamsListFail,
  getTeamsListSuccess,
  setSearchGroupTerm,
  getSearchGroupsListRequest,
  getSearchGroupsListSuccess,
  getSearchGroupsListFail,
} from './billingGroups.actions';

export interface IBillingGroupsState {
  billingInfoComplete: IBillingGroupsInfo;
  isLoadingTeams: boolean;
  searchGroupTerm: string;
  searchGroupResults: string[];
  isSearching: boolean;
  status: StateStatus;
  errors: TErrors;
}

export const initialState: IBillingGroupsState = {
  billingInfoComplete: {
    billingGroups: [],
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 1,
    },
  },
  isLoadingTeams: false,
  searchGroupTerm: '',
  searchGroupResults: [],
  isSearching: false,
  status: StateStatus.Idle,
  errors: {},
};

export const billingGroups = createReducer({}, initialState);

billingGroups
  .on(getGroupsListRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(getGroupsListSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    billingInfoComplete: {
      billingGroups: payload.data.map(billingInfo => ({
        billingInfo: {
          ...billingInfo,
        },
        teams: [],
        teamsLoaded: false,
        isLoadingTeams: false,
        isExpanded: true,
      })),
      pagination: state.isSearching ? { ...state.billingInfoComplete.pagination } : { ...payload.pagination },
    },
  }))
  .on(getGroupsListFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))
  .on(setBillingGroupsCurrentPage, (state, payload) => ({
    ...state,
    billingInfoComplete: {
      ...state.billingInfoComplete,
      pagination: {
        ...state.billingInfoComplete.pagination,
        currentPage: payload,
      },
    },
  }))
  .on(resetBillingGroupsResult, state => ({
    ...state,
    billingInfoComplete: {
      ...initialState.billingInfoComplete,
    },
    status: initialState.status,
  }));

const changeGroupTeamsState = (groupId: string | null, data: Partial<IBillingGroup>, state: IBillingGroupsState) => ({
  ...state,
  billingInfoComplete: {
    ...state.billingInfoComplete,
    billingGroups: [
      ...state.billingInfoComplete.billingGroups.map(group =>
        group.billingInfo.groupId === groupId
          ? {
              ...group,
              ...data,
            }
          : group,
      ),
    ],
  },
});

billingGroups
  .on(getTeamsListRequest, (state, payload) => changeGroupTeamsState(payload.groupId, { isLoadingTeams: true }, state))
  .on(getTeamsListSuccess, (state, payload) =>
    changeGroupTeamsState(
      payload.groupIds,
      { teams: [...payload.data], isLoadingTeams: false, teamsLoaded: true },
      state,
    ),
  )
  .on(getTeamsListFail, (state, payload) => changeGroupTeamsState(payload.groupId, { isLoadingTeams: false }, state));

billingGroups
  .on(setSearchGroupTerm, (state, payload) => ({
    ...state,
    searchGroupTerm: payload.searchGroupTerm,
    isSearching: payload.isSearching,
    billingInfoComplete: {
      ...state.billingInfoComplete,
      pagination: {
        ...initialState.billingInfoComplete.pagination,
      },
    },
  }))
  .on(getSearchGroupsListRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(getSearchGroupsListSuccess, (state, payload) => ({
    ...state,
    searchGroupResults: payload.data?.map(({ groupId }) => groupId) ?? [],
    billingInfoComplete: {
      ...state.billingInfoComplete,
      pagination: {
        ...payload.pagination,
      },
    },
  }))
  .on(getSearchGroupsListFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }));
