import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IBillingGroupsPayload, ITeamsPayload, ISearchGroupResultsPayload } from './billingGroups.types';

const PREFIX = `BILLING_GROUPS`;

export const getGroupsListRequest = createAction<{ isSearching: boolean }>(`${PREFIX}/GET_GROUPS_LIST.REQUEST`);
export const getGroupsListSuccess = createAction<IBillingGroupsPayload>(`${PREFIX}/GET_GROUPS_LIST.SUCCESS`);
export const getGroupsListFail = createAction<TErrors>(`${PREFIX}/GET_GROUPS_LIST.FAIL`);

export const resetBillingGroupsResult = createAction(`${PREFIX}/RESET_BILLING_GROUPS_RESULT`);

export const setBillingGroupsCurrentPage = createAction<number>(`${PREFIX}/SET_BILLING_GROUPS_CURRENT_PAGE`);

export const getTeamsListRequest = createAction<{ groupId: string | null }>(`${PREFIX}/GET_TEAMS_LIST.REQUEST`);
export const getTeamsListSuccess = createAction<ITeamsPayload>(`${PREFIX}/GET_TEAMS_LIST.SUCCESS`);
export const getTeamsListFail = createAction<{ groupId: string | null }>(`${PREFIX}/GET_TEAMS_LIST.FAIL`);

export const setSearchGroupTerm = createAction<{ searchGroupTerm: string; isSearching: boolean }>(
  `${PREFIX}/SET_SEARCH_GROUP_TERM`,
);

export const getSearchGroupsListRequest = createAction(`${PREFIX}/GET_SEARCH_GROUPS_LIST.REQUEST`);
export const getSearchGroupsListSuccess = createAction<ISearchGroupResultsPayload>(
  `${PREFIX}/GET_SEARCH_GROUPS_LIST.SUCCESS`,
);
export const getSearchGroupsListFail = createAction<TErrors>(`${PREFIX}/GET_SEARCH_GROUPS_LIST.FAIL`);
