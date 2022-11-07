import { pipe } from 'ramda';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../store/root.types';

const getBreakdownsState = (state: IRootState) => state.billing.breakdowns;

export const getSentGroups = pipe(getBreakdownsState, state => state.sent.groups);

export const getSentIsLoading = pipe(getBreakdownsState, state => state.sent.isLoading);

export const getSentTotalInvites = pipe(getBreakdownsState, state => state.sent.totalInvites);

export const getAcceptedGroups = pipe(getBreakdownsState, state => state.accepted.groups);

export const getAcceptedIsLoading = pipe(getBreakdownsState, state => state.accepted.isLoading);

export const getAcceptedTotalInvites = pipe(getBreakdownsState, state => state.accepted.totalInvites);

export const getAcceptedTotalMoney = pipe(getBreakdownsState, state => state.accepted.totalMoney);

export const getSentFilters = pipe(getBreakdownsState, state => state.sent.filters);

export const getAcceptedFilters = pipe(getBreakdownsState, state => state.accepted.filters);

const getAcceptedInventories = pipe(getBreakdownsState, state => state.accepted.inventories);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getAcceptedTeamInventoriesSelector = (groupId: string, teamId: number) =>
  createSelector(getAcceptedInventories, inventories =>
    (inventories[groupId]?.[teamId]?.list || []).filter(({ inventory }) => inventory.resource.count > 0),
  );

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getAcceptedTeamInventoriesIsLoadingSelector = (groupId: string, teamId: number) =>
  createSelector(getAcceptedInventories, inventories => inventories[groupId]?.[teamId]?.isLoading);
