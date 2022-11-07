import { pick, pipe, prop } from 'ramda';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../store/root.types';

import { ProductFilter } from './products.types';

const pathToProductsState = (state: IRootState) => state.marketplace.products;

export const getIsLoading = pipe(pathToProductsState, state => state.isLoading);

export const getIsLoaded = pipe(pathToProductsState, state => state.isLoaded);

export const getProducts = pipe(pathToProductsState, state => state.products);

export const getPagination = pipe(pathToProductsState, state => state.pagination);

export const getHasMore = pipe(pathToProductsState, state => state.hasMore);

export const getSorting = pipe(pathToProductsState, state => state.sort);

export const getSearch = pipe(pathToProductsState, state => state.search);

export const getFilters = pipe(pathToProductsState, state => state.filters);

export const getMinPrice = pipe(pathToProductsState, state => state.filters[ProductFilter.MinPrice]);

export const getMaxPrice = pipe(pathToProductsState, state => state.filters[ProductFilter.MaxPrice]);

export const getDonationPrice = pipe(pathToProductsState, state => state.filters[ProductFilter.DonationPrice]);

export const getGiftCardPrice = pipe(pathToProductsState, state => state.filters[ProductFilter.GiftCardPrice]);

export const getSelectedBrands = pipe(pathToProductsState, state => state.filters[ProductFilter.BrandIds]);

export const getSelectedMerchants = pipe(pathToProductsState, state => state.filters[ProductFilter.MerchantIds]);

export const getSelectedVendors = pipe(pathToProductsState, state => state.filters[ProductFilter.Vendors]);

export const getSelectedCountries = pipe(pathToProductsState, state => state.filters[ProductFilter.CountryIds]);

export const getSelectedCategoryIds = pipe(pathToProductsState, state => state.filters[ProductFilter.CategoryIds]);

export const getSelectedGiftTypes = pipe(pathToProductsState, state => state.filters[ProductFilter.TypeIds]);

export const getDefaultFilters = pipe(pathToProductsState, prop('defaultFilters'));

export const getGiftFilters = createSelector(
  getFilters,
  pick([
    ProductFilter.MinPrice,
    ProductFilter.MaxPrice,
    ProductFilter.DonationPrice,
    ProductFilter.GiftCardPrice,
    ProductFilter.TypeIds,
    ProductFilter.MerchantIds,
    ProductFilter.BrandIds,
    ProductFilter.Vendors,
  ]),
);

export const getBudgetFilters = createSelector(
  getFilters,
  pick([ProductFilter.MinPrice, ProductFilter.MaxPrice, ProductFilter.GiftCardPrice, ProductFilter.DonationPrice]),
);

export const getEntityIdsFilters = createSelector(
  getFilters,
  pick([
    ProductFilter.TypeIds,
    ProductFilter.BrandIds,
    ProductFilter.MerchantIds,
    ProductFilter.CategoryIds,
    ProductFilter.CountryIds,
  ]),
);

export const getHasSelectedCampaignFilters = createSelector(
  getSelectedGiftTypes,
  getSelectedBrands,
  getSelectedMerchants,
  (types, brands, merchants) => types.length > 0 || brands.length > 0 || merchants.length > 0,
);

export const getHasSelectedFilters = createSelector(
  getHasSelectedCampaignFilters,
  getSelectedCountries,
  getSelectedCategoryIds,
  (hasCampaignFilters, countries, categories) => hasCampaignFilters || countries.length > 0 || categories.length > 0,
);

const getAppliedPriceFiltersCount = createSelector(
  getMinPrice,
  getMaxPrice,
  getGiftCardPrice,
  getDonationPrice,
  (...filters) => filters.reduce<number>((acc, val) => (typeof val === 'number' ? acc + 1 : acc), 0),
);

const getAppliedEntitiesFiltersCount = createSelector(
  getSelectedGiftTypes,
  getSelectedBrands,
  getSelectedMerchants,
  getSelectedCountries,
  getSelectedCategoryIds,
  (...filters) =>
    filters.reduce<number>((acc, filter) => {
      if (filter.length > 0) {
        return acc + 1;
      }
      return acc;
    }, 0),
);

export const getAppliedFiltersCount = createSelector(
  getAppliedEntitiesFiltersCount,
  getAppliedPriceFiltersCount,
  (priceFilters, entitiesFilters) => priceFilters + entitiesFilters,
);

export const getIsGiftFiltersDirty = createSelector(
  getGiftFilters,
  ({
    [ProductFilter.MinPrice]: minPrice,
    [ProductFilter.MaxPrice]: maxPrice,
    [ProductFilter.DonationPrice]: donationPrice,
    [ProductFilter.GiftCardPrice]: giftCardPrice,
    [ProductFilter.TypeIds]: types,
    [ProductFilter.Vendors]: vendors,
  }) => !!minPrice || !!maxPrice || !!donationPrice || !!giftCardPrice || !!types.length || !!vendors.length,
);
