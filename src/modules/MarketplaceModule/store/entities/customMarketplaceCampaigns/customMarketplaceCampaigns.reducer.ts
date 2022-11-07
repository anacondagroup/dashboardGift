import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import * as actions from './customMarketplaceCampaigns.actions';
import { TShortCustomMarketplaceCampaign } from './customMarketplaceCampaigns.types';

export const customMarketplaceCampaignsAdapter = createEntityAdapter<TShortCustomMarketplaceCampaign>();

export const initialState = customMarketplaceCampaignsAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type ICustomMarketplaceCampaignsState = typeof initialState;

export const customMarketplaceCampaigns = createReducer({}, initialState);

customMarketplaceCampaigns.on(actions.fetchCustomMarketplaceCampaignsByIds, state => ({
  ...state,
  status: StateStatus.Pending,
}));
customMarketplaceCampaigns.on(actions.fetchCustomMarketplaceCampaignsSuccess, (state, customMarketplacesData) => ({
  ...state,
  ...customMarketplaceCampaignsAdapter.setAll(customMarketplacesData, state),
  status: StateStatus.Fulfilled,
}));
customMarketplaceCampaigns.on(actions.fetchCustomMarketplaceCampaignsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
