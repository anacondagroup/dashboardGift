import { EntityId } from '@alycecom/utils';

export type TProductType = {
  id: number;
  label: string;
  countryIds: number[];
};

export type TProductTypeCountryIdsFilters = {
  countryIds?: number[];
  restrictedBrandIds?: EntityId[];
  restrictedMerchantIds?: EntityId[];
};
