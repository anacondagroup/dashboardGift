import { combineReducers } from 'redux';

import { campaignsBreakdown, ICampaignManagementState } from './campaignsBreakdown/campaignsBreakdown.reducer';
import { campaignFilters } from './filters/filters.reducer';
import { ICampaignsFilters } from './filters/filters.types';

export interface ICampaignsManagementState {
  campaignsBreakdown: ICampaignManagementState;
  campaignFilters: ICampaignsFilters;
}

const campaignsManagement = combineReducers<ICampaignsManagementState>({
  campaignsBreakdown,
  campaignFilters,
});

export default campaignsManagement;
