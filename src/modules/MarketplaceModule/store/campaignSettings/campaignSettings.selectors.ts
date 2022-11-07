import { is, keys, map, not, omit, pickBy, pipe, prop, values, without } from 'ramda';
import { createSelector } from 'reselect';
import { EntityId, TDictionary } from '@alycecom/utils';
import { CommonData, User } from '@alycecom/modules';

import { IRootState } from '../../../../store/root.types';
import { getIsLoaded as getIsVendorsLoaded, getVendorsMap } from '../entities/productVendors/productVendors.selectors';
import { getIsLoaded as getIsTypesLoaded, getProductTypeIds } from '../entities/productTypes/productTypes.selectors';
import { ProductVendorsTypes, TProductVendor } from '../entities/productVendors/productVendors.types';
import { ProductFilter } from '../products/products.types';

import { ICampaignSettingsState } from './campaignSettings.reducer';
import { TRestrictedProductVendor } from './campaignSettings.types';

const getCampaignSettingsState = (state: IRootState): ICampaignSettingsState => state.marketplace.campaignSettings;

export const getIsLoaded = pipe(getCampaignSettingsState, prop('isLoaded'));

export const getIsLoading = pipe(getCampaignSettingsState, prop('isLoading'));

export const getErrors = pipe(getCampaignSettingsState, prop('errors'));

export const getCampaignId = pipe(getCampaignSettingsState, prop('campaignId'));

export const getIsInternational = pipe(getCampaignSettingsState, prop('isInternational'));

export const getCountryIds = pipe(getCampaignSettingsState, prop('countryIds'));

export const getCountries = createSelector(
  getCountryIds,
  CommonData.selectors.getCommonCountriesMap,
  (countryIds, countries) => countryIds.map(id => countries[id]).filter(country => Boolean(country)),
);

export const getMinPrice = pipe(getCampaignSettingsState, prop('minPrice'));

export const getMaxPrice = pipe(getCampaignSettingsState, prop('maxPrice'));

export const getGiftCardPrice = pipe(getCampaignSettingsState, prop('giftCardPrice'));

export const getDonationPrice = pipe(getCampaignSettingsState, prop('donationPrice'));

export const getRestrictedTypes = pipe(getCampaignSettingsState, prop('restrictedProductsTypes'));

export const getRestrictedTypeIds = createSelector(getRestrictedTypes, map(prop('id')));

export const getRestrictedVendors = pipe(getCampaignSettingsState, prop('restrictedProductsVendors'));

export const getCampaignType = pipe(getCampaignSettingsState, prop('type'));

export const getCampaignTeamId = pipe(getCampaignSettingsState, prop('teamId'));

export const getCampaignMarketplaceId = pipe(getCampaignSettingsState, prop('customMarketplaceId'));

export const getRestrictedBrandsIds = createSelector(getRestrictedVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Brand).map(vendor => vendor.id),
);

export const getRestrictedMerchantsIds = createSelector(getRestrictedVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Merchant).map(vendor => vendor.id),
);

export const getRestrictedVendorIds = createSelector(getRestrictedVendors, (vendors: TRestrictedProductVendor[]) =>
  vendors.map((vendor): EntityId => `${vendor.type}/${vendor.id}`),
);

export const getIsUserCanEditCampaign = createSelector(
  User.selectors.getUserCanManageTeams,
  getCampaignTeamId,
  (canEditTeams, teamId) => !!teamId && canEditTeams.includes(teamId),
);

export const getEnabledVendorsMap = createSelector(
  getIsLoaded,
  getIsVendorsLoaded,
  getRestrictedVendorIds,
  getVendorsMap,
  (isLoaded, isVendorsLoaded, restrictedIds, vendorsMap) =>
    isLoaded && isVendorsLoaded ? (omit(restrictedIds as string[], vendorsMap) as TDictionary<TProductVendor>) : {},
);

export const getEnabledVendors = createSelector(getEnabledVendorsMap, values);

export const getEnabledMerchantIds = createSelector(getEnabledVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Merchant).map(merchant => merchant.id),
);

export const getEnabledBrandIds = createSelector(getEnabledVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Brand).map(brand => brand.id),
);

export const getEnabledTypeIds = createSelector(
  getIsLoaded,
  getIsTypesLoaded,
  getRestrictedTypeIds,
  getProductTypeIds,
  (isLoaded, isTypesLoaded, restrictedTypeIds, typeIds) =>
    isLoaded && isTypesLoaded ? without(restrictedTypeIds, typeIds) : [],
);

export const getCampaignDefaultTypeIds = createSelector(
  getRestrictedTypeIds,
  getEnabledTypeIds,
  (restrictedIds, availableIds) => (restrictedIds.length === 0 ? [] : availableIds),
);

export const getCampaignDefaultMerchantIds = createSelector(
  getRestrictedMerchantsIds,
  getEnabledMerchantIds,
  (restrictedIds, availableIds) => (restrictedIds.length === 0 ? [] : availableIds),
);

export const getCampaignDefaultBrandIds = createSelector(
  getRestrictedBrandsIds,
  getEnabledBrandIds,
  (restrictedIds, availableIds) => (restrictedIds.length === 0 ? [] : availableIds),
);

export const getBudgetAsFilters = createSelector(
  getMinPrice,
  getMaxPrice,
  getDonationPrice,
  getGiftCardPrice,
  (minPrice, maxPrice, donationPrice, giftCardPrice) => ({
    [ProductFilter.MinPrice]: minPrice,
    [ProductFilter.MaxPrice]: maxPrice,
    [ProductFilter.DonationPrice]: donationPrice,
    [ProductFilter.GiftCardPrice]: giftCardPrice,
  }),
);

export const getCampaignSettingsAsFilters = createSelector(
  getBudgetAsFilters,
  getEnabledVendors,
  getEnabledMerchantIds,
  getEnabledBrandIds,
  getEnabledTypeIds,
  (budget, vendors, merchants, brands, types) => ({
    ...budget,
    [ProductFilter.Vendors]: vendors,
    [ProductFilter.MerchantIds]: merchants,
    [ProductFilter.BrandIds]: brands,
    [ProductFilter.TypeIds]: types,
  }),
);

export const getHiddenGiftFilters = createSelector(getCampaignId, getBudgetAsFilters, (campaignId, budget) => {
  if (!campaignId) {
    return undefined;
  }
  return pipe(pickBy(pipe(is(Number), not)), keys)(budget) as ProductFilter[];
});
