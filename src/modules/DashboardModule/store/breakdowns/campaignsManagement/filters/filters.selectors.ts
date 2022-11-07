import { omit, pipe } from 'ramda';
import { createSelector } from 'reselect';
import { pickNotEmpty } from '@alycecom/utils';
import { RowLimit } from '@alycecom/ui';

import { IRootState } from '../../../../../../store/root.types';

import { ICampaignsFilters } from './filters.types';

export const getCampaignsFiltersState = (state: IRootState): ICampaignsFilters =>
  state.dashboard.breakdowns.campaignsManagement.campaignFilters;

export const getCampaignsFiltersStateWithoutStatus = createSelector(getCampaignsFiltersState, state =>
  omit(['status'], state),
);

export const getStatusFilter = pipe(getCampaignsFiltersState, state => state.status);

export const getSearchFilter = pipe(getCampaignsFiltersState, state => state.search);

export const getTeamIdFilter = pipe(getCampaignsFiltersState, state => state.teamId);

export const getCountriesFilter = pipe(getCampaignsFiltersState, state => state.countryIds);

export const getSortFieldFilter = pipe(getCampaignsFiltersState, state => state.sortField);

export const getSortDirectionFilter = pipe(getCampaignsFiltersState, state => state.sortDirection);

export const getCurrentPageFilter = pipe(getCampaignsFiltersState, state => state.currentPage);

export const getLimitFilter = pipe(getCampaignsFiltersState, state => state.limit);

export const getFiltersAsPayload = createSelector(
  getStatusFilter,
  getSearchFilter,
  getTeamIdFilter,
  getCountriesFilter,
  getSortFieldFilter,
  getSortDirectionFilter,
  getCurrentPageFilter,
  getLimitFilter,
  (status, search, teamId, countryIds, sortField, sortDirection, currentPage, limit) => {
    const teamIds = teamId ? [teamId] : null;
    const currentPageValue = currentPage || 1;
    const limitValue = limit || RowLimit.Limit10;
    return pickNotEmpty({
      status,
      search,
      teamIds,
      countryIds,
      sort: {
        field: sortField,
        direction: sortDirection,
      },
      pagination: {
        limit: limitValue,
        offset: limitValue * (currentPageValue - 1),
      },
    });
  },
);
