import { createAction } from 'redux-act';

import { TShortCustomMarketplaceCampaign } from './customMarketplaceCampaigns.types';

const prefix = `MARKETPLACE/CUSTOM_MARKETPLACE_CAMPAIGNS`;

export const fetchCustomMarketplaceCampaignsByIds = createAction<number[]>(`${prefix}/FETCH_REQUEST`);
export const fetchCustomMarketplaceCampaignsSuccess = createAction<TShortCustomMarketplaceCampaign[]>(
  `${prefix}/FETCH_SUCCESS`,
);
export const fetchCustomMarketplaceCampaignsFail = createAction(`${prefix}/FETCH_FAIL`);
