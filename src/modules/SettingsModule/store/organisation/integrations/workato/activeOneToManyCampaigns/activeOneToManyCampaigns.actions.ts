import { createAsyncAction } from '@alycecom/utils';

import {
  TWorkatoActiveOneToManyCampaigns,
  TWorkatoActiveOneToManyCampaignsFulfilled,
  TWorkatoActiveOneToManyCampaignsIdentifier,
} from './activeOneToManyCampaigns.types';

const PREFIX = 'SETTINGS_MODULE/WORKATO/UTILS';

export const loadWorkatoActiveOneToManyCampaigns = createAsyncAction<
  TWorkatoActiveOneToManyCampaigns & TWorkatoActiveOneToManyCampaignsIdentifier,
  TWorkatoActiveOneToManyCampaignsFulfilled & TWorkatoActiveOneToManyCampaignsIdentifier,
  TWorkatoActiveOneToManyCampaignsIdentifier
>(`${PREFIX}/LOAD_WORKATO_CAMPAIGNS_LIST`);

export const clearWorkatoActiveOneToManyCampaigns = createAsyncAction<TWorkatoActiveOneToManyCampaignsIdentifier>(
  `${PREFIX}/CLEAR_WORKATO_CAMPAIGNS_LIST`,
);
