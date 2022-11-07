import { createAction } from 'redux-act';

import { IInventoryDeposits } from '../../types';

import { IGroupedResources } from './breakdowns.types';

const PREFIX = 'BILLING_INSIGHTS';

export const sentInvitesRequest = createAction(`${PREFIX}/SENT_INVITES.REQUEST`);
export const sentInvitesSuccess = createAction<IGroupedResources>(`${PREFIX}/SENT_INVITES.SUCCESS`);
export const sentInvitesFailure = createAction(`${PREFIX}/SENT_INVITES.FAIL`);

export const acceptedInvitesRequest = createAction(`${PREFIX}/ACCEPTED_INVITES.REQUEST`);
export const acceptedInvitesSuccess = createAction<IGroupedResources>(`${PREFIX}/ACCEPTED_INVITES.SUCCESS`);
export const acceptedInvitesFailure = createAction(`${PREFIX}/ACCEPTED_INVITES.FAIL`);

export const setFilters = createAction<{ preset: string; from?: string; to?: string }>(`${PREFIX}/SET_FILTERS`);

export const acceptedTeamInventoriesRequest = createAction<{ groupId: string; teamId: number }>(
  `${PREFIX}/ACCEPTED_TEAM_INVENTORIES.REQUEST`,
);
export const acceptedTeamInventoriesSuccess = createAction<{
  groupId: string;
  teamId: number;
  inventories: IInventoryDeposits[];
}>(`${PREFIX}/ACCEPTED_TEAM_INVENTORIES.SUCCESS`);
export const acceptedTeamInventoriesFailure = createAction<{ groupId: string; teamId: number }>(
  `${PREFIX}/ACCEPTED_TEAM_INVENTORIES.FAIL`,
);

export const emailReportRequest = createAction<string>(`${PREFIX}/EMAIL_REPORT.REQUEST`);
export const emailReportSuccess = createAction(`${PREFIX}/EMAIL_REPORT.SUCCESS`);
export const emailReportFailure = createAction(`${PREFIX}/EMAIL_REPORT.FAIL`);
