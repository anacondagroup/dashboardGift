import { createAction } from 'redux-act';

import { IAccountResources, IGroupInfo, IOperation, ITeamInfo } from '../../types';

import { ICustomerStats, IOrgHierarchy, IOrgInfo, ITeamsFilter } from './customerOrg.types';

const PREFIX = 'BILLING/CUSTOMER_ORG';

export const customerOrgRequest = createAction(`${PREFIX}/CUSTOMER_ORG.REQUEST`);
export const customerOrgSuccess = createAction<IOrgInfo>(`${PREFIX}/CUSTOMER_ORG.SUCCESS`);
export const customerOrgFailure = createAction(`${PREFIX}/CUSTOMER_ORG.FAIL`);

export const orgTeamsRequest = createAction(`${PREFIX}/ORG_TEAMS.REQUEST`);
export const orgTeamsSuccess = createAction<ITeamInfo[]>(`${PREFIX}/ORG_TEAMS.SUCCESS`);
export const orgTeamsFailure = createAction(`${PREFIX}/ORG_TEAMS.FAIL`);

export const orgGroupsRequest = createAction(`${PREFIX}/ORG_GROUPS.REQUEST`);
export const orgGroupsSuccess = createAction<IGroupInfo[]>(`${PREFIX}/ORG_GROUPS.SUCCESS`);
export const orgGroupsFailure = createAction(`${PREFIX}/ORG_GROUPS.FAIL`);

export const setTeamsFilter = createAction<ITeamsFilter>(`${PREFIX}/SET_TEAMS_FILTER`);
export const setCurrentGroupSelected = createAction<string | null>(`${PREFIX}/SET_CURRENT_TEAM_SELECTED`);

export const loadStatsRequest = createAction(`${PREFIX}/LOAD_STATS_REQUEST`);
export const loadStatsSuccess = createAction<ICustomerStats>(`${PREFIX}/LOAD_STATS_SUCCESS`);
export const loadStatsFail = createAction(`${PREFIX}/LOAD_STATS_FAIL`);

export const loadResourcesRequest = createAction(`${PREFIX}/LOAD_RESOURCES_REQUEST`);
export const loadResourcesSuccess = createAction<IAccountResources>(`${PREFIX}/LOAD_RESOURCES_SUCCESS`);
export const loadResourcesFail = createAction(`${PREFIX}/LOAD_RESOURCES_FAIL`);

export const loadHierarchyRequest = createAction(`${PREFIX}/LOAD_HIERARCHY_REQUEST`);
export const loadHierarchySuccess = createAction<IOrgHierarchy>(`${PREFIX}/LOAD_HIERARCHY_SUCCESS`);
export const loadHierarchyFail = createAction(`${PREFIX}/LOAD_HIERARCHY_FAIL`);

export const setSelectedHierarchyId = createAction<string>(`${PREFIX}/SET_SELECTED_HIERARCHY_ID`);

export const loadLastInvoiceRequest = createAction(`${PREFIX}/LOAD_LAST_INVOICE_REQUEST`);
export const loadLastInvoiceSuccess = createAction<IOperation>(`${PREFIX}/LOAD_LAST_INVOICE_SUCCESS`);
export const loadLastInvoiceFail = createAction(`${PREFIX}/LOAD_LAST_INVOICE_FAIL`);
