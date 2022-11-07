import { ICampaignListItem } from '../../../../campaigns/campaigns.types';

export type TWorkatoActiveOneToManyCampaignsIdentifier = { autocompleteIdentifier: string };
export type TWorkatoActiveOneToManyCampaigns = { quantity: number; search?: string };
export type TWorkatoActiveOneToManyCampaignsFulfilled = {
  campaigns: ICampaignListItem[];
};
