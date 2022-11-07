import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { ICampaignListItem } from '../../../../campaigns/campaigns.types';

import {
  clearWorkatoActiveOneToManyCampaigns,
  loadWorkatoActiveOneToManyCampaigns,
} from './activeOneToManyCampaigns.actions';

export type TActiveOneToManyCampaignsState = {
  [campaignIdentifier: string]: { campaigns: ICampaignListItem[]; status: StateStatus };
};

const initialState: TActiveOneToManyCampaignsState = {};

export const activeOneToManyCampaigns = createReducer({}, initialState)
  .on(loadWorkatoActiveOneToManyCampaigns.pending, (state, { autocompleteIdentifier }) => ({
    ...state,
    [autocompleteIdentifier]: {
      campaigns: [],
      status: StateStatus.Pending,
    },
  }))
  .on(loadWorkatoActiveOneToManyCampaigns.fulfilled, (state, { autocompleteIdentifier, campaigns }) => ({
    ...state,
    [autocompleteIdentifier]: {
      campaigns,
      status: StateStatus.Fulfilled,
    },
  }))
  .on(loadWorkatoActiveOneToManyCampaigns.rejected, (state, { autocompleteIdentifier }) => ({
    ...state,
    [autocompleteIdentifier]: {
      campaigns: [],
      status: StateStatus.Rejected,
    },
  }))
  .on(clearWorkatoActiveOneToManyCampaigns, (state, { autocompleteIdentifier }) => {
    const current = { ...state };
    delete current[autocompleteIdentifier];
    return current;
  });
