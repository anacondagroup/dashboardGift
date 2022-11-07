import { EntityId } from '@alycecom/utils';

import { ProductVendorsTypes, TProductVendor } from '../entities/productVendors/productVendors.types';
import { ProductFilter } from '../products/products.types';
import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';

export type TRestrictedProductType = {
  id: EntityId;
  isRestrictedForCampaign: boolean;
  isRestrictedForTeam: boolean;
};

export type TRestrictedProductVendor = TRestrictedProductType & {
  type: ProductVendorsTypes;
};

export type TMarketplaceCampaignSettings = {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  giftCardPrice: number | undefined;
  donationPrice: number | undefined;
  teamId: number | null;
  customMarketplaceId: number | null;
  restrictedProductsTypes: TRestrictedProductType[];
  restrictedProductsVendors: TRestrictedProductVendor[];
  isInternational: boolean;
  countryIds: number[];
  type: CAMPAIGN_TYPES;
};

export type TCampaignMarketplaceForm = {
  [ProductFilter.MinPrice]?: number | null;
  [ProductFilter.MaxPrice]?: number | null;
  [ProductFilter.DonationPrice]?: number | null;
  [ProductFilter.GiftCardPrice]?: number | null;
  [ProductFilter.TypeIds]: EntityId[];
  [ProductFilter.BrandIds]: EntityId[];
  [ProductFilter.MerchantIds]: EntityId[];
  [ProductFilter.Vendors]: TProductVendor[];
};
