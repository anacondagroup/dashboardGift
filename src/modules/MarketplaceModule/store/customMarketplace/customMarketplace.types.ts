import { TErrors } from '@alycecom/services';
import { EntityId } from '@alycecom/utils';

import { TProductVendor } from '../entities/productVendors/productVendors.types';
import { ProductFilter } from '../products/products.types';

export type TCustomMarketplace = {
  id: number;
  name: string;
  countryIds: number[];
  minPrice: number | null;
  maxPrice: number | null;
  donationPrice: number | null;
  giftCardPrice: number | null;
  teamIds: number[];
  productIds: number[];
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
  updatedBy: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  campaignIds: number[];
  createdAt: string;
  updatedAt?: string;
};

export type TCustomMarketplaceErrors = TErrors<TCustomMarketplaceCreatePayload>;

export enum CustomMarketplaceField {
  Name = 'name',
  CountryIds = 'countryIds',
  TeamIds = 'teamIds',
  MinPrice = 'minPrice',
  MaxPrice = 'maxPrice',
  GiftCardPrice = 'giftCardPrice',
  DonationPrice = 'donationPrice',
  IsDonationsAllowed = 'isDonationsAllowed',
  IsGiftCardsAllowed = 'isGiftCardsAllowed',
  IsPhysicalGiftsAllowed = 'isPhysicalGiftsAllowed',
}

export type TCustomMarketplaceForm = {
  [CustomMarketplaceField.Name]: string;
  [CustomMarketplaceField.CountryIds]: number[];
  [CustomMarketplaceField.TeamIds]: number[];
  [CustomMarketplaceField.MinPrice]: number | null;
  [CustomMarketplaceField.MaxPrice]: number | null;
  [CustomMarketplaceField.GiftCardPrice]: number | null;
  [CustomMarketplaceField.DonationPrice]: number | null;
  [CustomMarketplaceField.IsDonationsAllowed]: boolean;
  [CustomMarketplaceField.IsGiftCardsAllowed]: boolean;
  [CustomMarketplaceField.IsPhysicalGiftsAllowed]: boolean;
};

export type TCustomMarketplaceCreatePayload = {
  [CustomMarketplaceField.Name]: string;
  [CustomMarketplaceField.CountryIds]: number[];
  [CustomMarketplaceField.TeamIds]: number[];
  [CustomMarketplaceField.MinPrice]: number | null;
  [CustomMarketplaceField.MaxPrice]: number | null;
  [CustomMarketplaceField.GiftCardPrice]: number | null;
  [CustomMarketplaceField.DonationPrice]: number | null;
};

export type TCustomMarketplaceGiftFilters = {
  [ProductFilter.MinPrice]: number | null;
  [ProductFilter.MaxPrice]: number | null;
  [ProductFilter.DonationPrice]: number | null;
  [ProductFilter.GiftCardPrice]: number | null;
  [ProductFilter.TypeIds]: EntityId[];
  [ProductFilter.BrandIds]: EntityId[];
  [ProductFilter.MerchantIds]: EntityId[];
  [ProductFilter.Vendors]: TProductVendor[];
};
