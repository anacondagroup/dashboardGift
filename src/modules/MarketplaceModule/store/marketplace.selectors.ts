import { createSelector } from 'reselect';
import { equals, pick, values } from 'ramda';
import { EntityId, TDictionary } from '@alycecom/utils';

import { IRootState } from '../../../store/root.types';
import { getCampaigns } from '../../../store/campaigns/campaigns.selectors';
import { MarketplacesListOptionType } from '../types';
import { IOption } from '../components/MarketplacesList/option';
import { GiftExchangeOptions } from '../../ActivateModule/constants/exchange.constants';

import {
  getSelectedGiftTypes,
  getSelectedBrands,
  getSelectedMerchants,
  getSelectedCategoryIds,
  getBudgetFilters,
  getIsLoaded as getIsProductsLoaded,
  getSelectedVendors,
  getFilters,
  getIsGiftFiltersDirty,
} from './products/products.selectors';
import {
  getBudgetAsFilters,
  getCampaignId,
  getIsLoaded,
  getRestrictedBrandsIds,
  getRestrictedMerchantsIds,
  getRestrictedTypeIds,
} from './campaignSettings/campaignSettings.selectors';
import {
  getIsLoaded as getIsVendorsLoaded,
  getBrandIds,
  getMerchantIds,
} from './entities/productVendors/productVendors.selectors';
import { getProductTypeIds, getIsLoaded as getIsTypesLoaded } from './entities/productTypes/productTypes.selectors';
import { getCategoriesMap } from './entities/productCategories/productCategories.selectors';
import { TProductCategory } from './entities/productCategories/productCategories.types';
import { getCustomMarketplaces } from './entities/customMarketplaces/customMarketplaces.selectors';
import { getCustomMarketplaceAsFilters } from './customMarketplace/customMarketplace.selectors';
import { MARKETPLACE_DEFAULT_OPTION } from './marketplace.constants';
import { ProductFilter } from './products/products.types';

export const getRestrictedBrands = createSelector(
  getIsVendorsLoaded,
  getSelectedBrands,
  getBrandIds,
  (isLoaded, brandIds, allBrandIds) => (isLoaded ? allBrandIds.filter(brandId => !brandIds.includes(brandId)) : []),
);

export const getRestrictedMerchants = createSelector(
  getIsVendorsLoaded,
  getSelectedMerchants,
  getMerchantIds,
  (isLoaded, merchantIds, allMerchantIds) =>
    isLoaded ? allMerchantIds.filter(merchantId => !merchantIds.includes(merchantId)) : [],
);

export const getDisabledTypes = createSelector(
  getIsTypesLoaded,
  getSelectedGiftTypes,
  getProductTypeIds,
  (isLoaded, typeIds, allTypeIds) => (isLoaded ? allTypeIds.filter(typeId => !typeIds.includes(typeId)) : []),
);

export const getIsCampaignMarketplaceLoaded = createSelector(
  getIsLoaded,
  getIsVendorsLoaded,
  getIsTypesLoaded,
  getCampaignId,
  (isSettingsLoaded, isVendorsLoaded, isTypesLoaded, campaignId) =>
    isSettingsLoaded && isVendorsLoaded && isTypesLoaded && !!campaignId,
);

export const getIsVendorsDiffWithCampaignSettings = createSelector(
  getIsCampaignMarketplaceLoaded,
  getRestrictedMerchants,
  getRestrictedBrands,
  getRestrictedMerchantsIds,
  getRestrictedBrandsIds,
  (isLoaded, filterRestrictedMerchants, filterRestrictedBrands, restrictedMerchants, restrictedBrands) =>
    isLoaded &&
    (filterRestrictedBrands.length !== restrictedBrands.length ||
      (filterRestrictedBrands.length !== 0 && !filterRestrictedBrands.every(id => restrictedBrands.includes(id))) ||
      filterRestrictedMerchants.length !== restrictedMerchants.length ||
      (filterRestrictedMerchants.length !== 0 &&
        !filterRestrictedMerchants.every(id => restrictedMerchants.includes(id)))),
);

export const getIsTypesDiffWithCampaignSettings = createSelector(
  getIsCampaignMarketplaceLoaded,
  getDisabledTypes,
  getRestrictedTypeIds,
  (isLoaded, restrictedTypes, restrictedSettingsTypes) =>
    isLoaded &&
    (restrictedTypes.length !== restrictedSettingsTypes.length ||
      (restrictedTypes.length !== 0 && !restrictedTypes.every(id => restrictedSettingsTypes.includes(id)))),
);

export const getIsBudgetDiffWithCampaignSettings = createSelector(
  getIsCampaignMarketplaceLoaded,
  getBudgetFilters,
  getBudgetAsFilters,
  (isLoaded, filtersBudget, campaignBudget) => isLoaded && !equals(filtersBudget, campaignBudget),
);

export const getIsFiltersDiffWithCampaignSettings = createSelector(
  getIsBudgetDiffWithCampaignSettings,
  getIsVendorsDiffWithCampaignSettings,
  getIsTypesDiffWithCampaignSettings,
  (isBudgetChanged, isVendorsChanged, isTypesChanged) => isBudgetChanged || isVendorsChanged || isTypesChanged,
);

export const getSelectedCategories = createSelector<
  IRootState,
  EntityId[],
  TDictionary<TProductCategory>,
  TProductCategory[]
>(getSelectedCategoryIds, getCategoriesMap, (categoryIds, categoryMap) => {
  const categories = pick(categoryIds as string[], categoryMap);
  return values(categories);
});

export const getIsDefaultMarketplaceLoaded = createSelector(
  getIsVendorsLoaded,
  getIsTypesLoaded,
  getIsProductsLoaded,
  (isVendorsLoaded, isTypesLoaded, isProductsLoaded) => isVendorsLoaded && isTypesLoaded && isProductsLoaded,
);

export const getMarketplacesOptions = createSelector(
  getCampaigns,
  getCustomMarketplaces,
  (campaigns, customMarketplaces): IOption[] => [
    { ...MARKETPLACE_DEFAULT_OPTION },
    ...campaigns
      .filter(campaign => campaign.giftExchangeOption !== GiftExchangeOptions.acceptOnly)
      .map(({ id, name }) => ({
        id,
        type: MarketplacesListOptionType.Campaigns,
        label: name,
      })),
    ...customMarketplaces.map(({ id, name, productsCount }) => ({
      id,
      type: MarketplacesListOptionType.CustomMarketplaces,
      label: name,
      productsCount,
    })),
  ],
);

export const getIsCustomMarketplaceSettingsDiffWithFilters = createSelector(
  getFilters,
  getCustomMarketplaceAsFilters,
  (filters, marketplace) =>
    filters[ProductFilter.MinPrice] !== marketplace[ProductFilter.MinPrice] ||
    filters[ProductFilter.MaxPrice] !== marketplace[ProductFilter.MaxPrice] ||
    filters[ProductFilter.DonationPrice] !== marketplace[ProductFilter.DonationPrice] ||
    filters[ProductFilter.GiftCardPrice] !== marketplace[ProductFilter.GiftCardPrice] ||
    !equals(filters[ProductFilter.CountryIds], marketplace[ProductFilter.CountryIds]),
);

export const getIsCustomMarketplaceFiltersChanged = createSelector(
  getSelectedGiftTypes,
  getSelectedVendors,
  (typeIds, vendors) => typeIds.length !== 0 || vendors.length !== 0,
);

export const getCampaignMarketplaceHasChanges = createSelector(
  getCampaignId,
  getIsFiltersDiffWithCampaignSettings,
  getIsGiftFiltersDirty,
  getIsCampaignMarketplaceLoaded,
  getIsDefaultMarketplaceLoaded,
  (id, isDiffWithCampaign, isDirty, isCampaignMarketplaceLoaded, isDefaultMarketplaceLoaded) => {
    const isCampaignMarketplaceHasChanges = !!id && isDiffWithCampaign && isCampaignMarketplaceLoaded;
    const isDefaultMarketplaceHasChanges = !id && isDirty && isDefaultMarketplaceLoaded;
    return isCampaignMarketplaceHasChanges || isDefaultMarketplaceHasChanges;
  },
);
