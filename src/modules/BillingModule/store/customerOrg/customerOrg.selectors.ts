import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const getCustomerOrgState = (state: IRootState) => state.billing.customerOrg;

export const getOrg = pipe(getCustomerOrgState, state => state.org);
export const getOrgTeams = pipe(getCustomerOrgState, state => state.teams.list);
export const getOrgGroups = pipe(getCustomerOrgState, state => state.groups.list);

export const getTeamsFilter = pipe(getCustomerOrgState, state => state.teamsFilter);
export const getSelectedGroup = pipe(getCustomerOrgState, state => state.selectedGroup);

export const getStats = pipe(getCustomerOrgState, state => state.stats);
export const getResources = pipe(getCustomerOrgState, state => state.resources);

export const getHierarchy = pipe(getCustomerOrgState, state => state.hierarchy.data);
export const getHierarchyIsLoading = pipe(getCustomerOrgState, state => state.hierarchy.isLoading);
export const getSelectedAccount = pipe(getCustomerOrgState, state => state.hierarchy.selectedAccount);

export const getLastInvoice = pipe(getCustomerOrgState, state => state.lastInvoice.data);
export const getLastInvoiceIsLoading = pipe(getCustomerOrgState, state => state.lastInvoice.isLoading);
