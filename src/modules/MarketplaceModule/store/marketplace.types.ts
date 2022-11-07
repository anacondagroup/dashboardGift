import { IOption } from '@alycecom/ui';

import { FilterFieldName, IProductFilterQueryParams } from './products/products.types';

export enum CampaignBudgetField {
  minPrice = 'minPrice',
  maxPrice = 'maxPrice',
  giftCardPrice = 'giftCardPrice',
  donationPrice = 'donationPrice',
}

export interface ICampaignBudget {
  [CampaignBudgetField.minPrice]: number | undefined;
  [CampaignBudgetField.maxPrice]: number | undefined;
  [CampaignBudgetField.giftCardPrice]: number | undefined;
  [CampaignBudgetField.donationPrice]: number | undefined;
}

export interface ICampaignFilters extends ICampaignBudget {
  [FilterFieldName.types]: IOption[];
  [FilterFieldName.vendors]: IOption[];
}

export interface IMarketplaceModuleUrlParams extends IProductFilterQueryParams {
  contactId?: string;
  giftId?: string;
  sidebarTab?: string;
  enrichmentId?: string;
  teamId?: string;
  campaignId?: string;
}
