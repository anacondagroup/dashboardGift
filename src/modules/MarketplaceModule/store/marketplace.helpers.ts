import { TDictionary, parseArrayOfNumbers, parseNumber } from '@alycecom/utils';
import { parse } from 'query-string';
import { pick, pickBy } from 'ramda';

import { ProductVendorsTypes, TProductVendor } from './entities/productVendors/productVendors.types';
import { IFilters, IProductFilterQueryParams, ProductFilter } from './products/products.types';

export const rCampaignMarketplace = /marketplace\/campaign\/(\d+)\/?$/;
export const rDefaultMarketplace = /marketplace\/campaign\/?$/;
export const rCustomMarketplace = /marketplace\/custom\/(\d+)\/?$/;

export const parseParams = (
  availableVendors: TDictionary<TProductVendor> = {},
): [IProductFilterQueryParams, IFilters] => {
  const params = parse(window.location.search) as IProductFilterQueryParams;
  const merchants = parseArrayOfNumbers(params.merchants).map((id): string => `${ProductVendorsTypes.Merchant}/${id}`);
  const brands = parseArrayOfNumbers(params.brands).map((id): string => `${ProductVendorsTypes.Brand}/${id}`);
  const vendors = pick([...brands, ...merchants], availableVendors);
  const filters = {
    [ProductFilter.MinPrice]: parseNumber(params.minPrice),
    [ProductFilter.MaxPrice]: parseNumber(params.maxPrice),
    [ProductFilter.GiftCardPrice]: parseNumber(params.giftCardPrice),
    [ProductFilter.DonationPrice]: parseNumber(params.donationPrice),
    [ProductFilter.CategoryIds]: parseArrayOfNumbers(params.categories),
    [ProductFilter.CountryIds]: parseArrayOfNumbers(params.countries),
    [ProductFilter.MerchantIds]: Object.values(vendors)
      .filter(vendor => vendor.type === ProductVendorsTypes.Merchant)
      .map(merchant => merchant.id),
    [ProductFilter.BrandIds]: Object.values(vendors)
      .filter(vendor => vendor.type === ProductVendorsTypes.Brand)
      .map(brand => brand.id),
    [ProductFilter.TypeIds]: parseArrayOfNumbers(params.types),
    [ProductFilter.Vendors]: Object.values(vendors),
  };
  return [params, filters];
};

export const reduceFilters = (filters: Partial<IFilters>): Partial<IFilters> => {
  let finalFilters = filters;

  finalFilters = pickBy(
    value =>
      !(typeof value === 'undefined' || (Array.isArray(value) && (value as unknown[]).length === 0) || value === ''),
  )(finalFilters);

  return finalFilters;
};
