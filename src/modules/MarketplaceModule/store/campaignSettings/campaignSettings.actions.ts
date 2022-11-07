import { createAction } from 'redux-act';

import { TMarketplaceCampaignSettings } from './campaignSettings.types';

const prefix = 'MARKETPLACE/CAMPAIGN_SETTINGS';

export const fetchCampaignSettings = createAction<number>(`${prefix}/FETCH_REQUEST`);
export const fetchCampaignSettingsSuccess = createAction<TMarketplaceCampaignSettings & { campaignId: number }>(
  `${prefix}/FETCH_SUCCESS`,
);
export const fetchCampaignSettingsFail = createAction(`${prefix}/FETCH_FAIL`);
export const resetCampaignSettings = createAction(`${prefix}/RESET`);
