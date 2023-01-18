import { createReducer } from 'redux-act';

import { TABLE_SORT } from '../../../../../../components/Shared/CustomTable/customTable.constants';
import { CAMPAIGN_STATUS } from '../../../../../../constants/campaignSettings.constants';

import { resetFilters, setFilters } from './filters.actions';
import { ICampaignsFilters, SortField } from './filters.types';

export const initialCampaignsFiltersState: ICampaignsFilters = {
  status: CAMPAIGN_STATUS.ACTIVE,
  search: null,
  teamId: null,
  includeArchived: false,
  sortField: SortField.Updated,
  sortDirection: TABLE_SORT.DESC,
  countryIds: null,
  currentPage: 1,
  limit: null,
};

export const campaignFilters = createReducer<ICampaignsFilters>({}, initialCampaignsFiltersState);

campaignFilters
  .on(setFilters, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .on(resetFilters, () => ({
    ...initialCampaignsFiltersState,
  }));
