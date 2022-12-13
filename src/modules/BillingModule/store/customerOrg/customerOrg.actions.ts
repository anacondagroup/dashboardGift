import { createAction } from 'redux-act';
import { TTransaction, TGroupInfo, TTeamInfo } from '@alycecom/services';

import { IAccountResources } from '../../types';

import { ICustomerStats, ITeamsFilter } from './customerOrg.types';

const PREFIX = 'BILLING/CUSTOMER_ORG';

export const orgTeamsRequest = createAction(`${PREFIX}/ORG_TEAMS.REQUEST`);
export const orgTeamsSuccess = createAction<TTeamInfo[]>(`${PREFIX}/ORG_TEAMS.SUCCESS`);
export const orgTeamsFailure = createAction(`${PREFIX}/ORG_TEAMS.FAIL`);

export const orgGroupsRequest = createAction(`${PREFIX}/ORG_GROUPS.REQUEST`);
export const orgGroupsSuccess = createAction<TGroupInfo[]>(`${PREFIX}/ORG_GROUPS.SUCCESS`);
export const orgGroupsFailure = createAction(`${PREFIX}/ORG_GROUPS.FAIL`);

export const setTeamsFilter = createAction<ITeamsFilter>(`${PREFIX}/SET_TEAMS_FILTER`);
export const setCurrentGroupSelected = createAction<string | null>(`${PREFIX}/SET_CURRENT_TEAM_SELECTED`);

export const loadStatsRequest = createAction(`${PREFIX}/LOAD_STATS_REQUEST`);
export const loadStatsSuccess = createAction<ICustomerStats>(`${PREFIX}/LOAD_STATS_SUCCESS`);
export const loadStatsFail = createAction(`${PREFIX}/LOAD_STATS_FAIL`);

export const loadResourcesRequest = createAction(`${PREFIX}/LOAD_RESOURCES_REQUEST`);
export const loadResourcesSuccess = createAction<IAccountResources>(`${PREFIX}/LOAD_RESOURCES_SUCCESS`);
export const loadResourcesFail = createAction(`${PREFIX}/LOAD_RESOURCES_FAIL`);

export const loadLastInvoiceRequest = createAction(`${PREFIX}/LOAD_LAST_INVOICE_REQUEST`);
export const loadLastInvoiceSuccess = createAction<TTransaction>(`${PREFIX}/LOAD_LAST_INVOICE_SUCCESS`);
export const loadLastInvoiceFail = createAction(`${PREFIX}/LOAD_LAST_INVOICE_FAIL`);
