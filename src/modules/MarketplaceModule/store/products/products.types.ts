import { IProduct } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';

import { TProductVendor } from '../entities/productVendors/productVendors.types';

export interface IPagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ISort {
  id: number;
  value: {
    column: string;
    order: string;
  };
}

export interface IProductFilterQueryParams {
  page?: number;
  perPage?: number;
  orderColumn?: string;
  orderDirection?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  giftCardPrice?: string | number;
  donationPrice?: string | number;
  search?: string;
  types?: string;
  brands?: string;
  merchants?: string;
  categories?: string;
  countries?: string;
  teamIds?: string;
}

export enum ProductFilter {
  MinPrice = 'minPrice',
  MaxPrice = 'maxPrice',
  GiftCardPrice = 'giftCardPrice',
  DonationPrice = 'donationPrice',
  Search = 'search',
  TypeIds = 'types',
  BrandIds = 'brands',
  MerchantIds = 'merchants',
  CategoryIds = 'categories',
  CountryIds = 'countries',
  MarketplaceId = 'marketplaceId',
  Vendors = 'vendors',
  CampaignsCustomMarketplaces = 'campaignsCustomMarketplaces',
  TeamIds = 'teamIds',
  HiddenProductIds = 'hideProducts',
}

export enum FilterFieldName {
  types = 'types',
  brands = 'brands',
  merchants = 'merchants',
  categories = 'categories',
  countries = 'countries',
  vendors = 'vendors',
}

export interface IFilters {
  [ProductFilter.TypeIds]: EntityId[];
  [ProductFilter.BrandIds]: EntityId[];
  [ProductFilter.MerchantIds]: EntityId[];
  [ProductFilter.CategoryIds]: EntityId[];
  [ProductFilter.CountryIds]: EntityId[];
  [ProductFilter.Vendors]: TProductVendor[];
  [ProductFilter.MinPrice]?: number | null;
  [ProductFilter.MaxPrice]?: number | null;
  [ProductFilter.DonationPrice]?: number | null;
  [ProductFilter.GiftCardPrice]?: number | null;
  [ProductFilter.TeamIds]?: number[];
  [ProductFilter.Search]?: string;
  [ProductFilter.MarketplaceId]?: number;
  [ProductFilter.HiddenProductIds]?: number[];
}

export interface IProductsResponse {
  data: IProduct[];
  pagination: IPagination;
}

export interface IProductsFilters {
  [ProductFilter.TypeIds]?: EntityId[];
  [ProductFilter.BrandIds]?: EntityId[];
  [ProductFilter.MerchantIds]?: EntityId[];
  [ProductFilter.Vendors]?: TProductVendor[];
  [ProductFilter.MinPrice]?: number | null;
  [ProductFilter.MaxPrice]?: number | null;
  [ProductFilter.DonationPrice]?: number | null;
  [ProductFilter.GiftCardPrice]?: number | null;
}
