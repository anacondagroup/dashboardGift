import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const getCustomerOrgState = (state: IRootState) => state.billing.customerOrg;

export const getOrgTeams = pipe(getCustomerOrgState, state => state.teams.list);
export const getOrgGroups = pipe(getCustomerOrgState, state => state.groups.list);

export const getTeamsFilter = pipe(getCustomerOrgState, state => state.teamsFilter);
export const getSelectedGroup = pipe(getCustomerOrgState, state => state.selectedGroup);

export const getStats = pipe(getCustomerOrgState, state => state.stats);
export const getResources = pipe(getCustomerOrgState, state => state.resources);
