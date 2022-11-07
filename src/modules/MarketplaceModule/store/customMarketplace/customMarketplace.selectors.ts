import { pipe, prop, propEq, propOr, without } from 'ramda';
import { createSelector } from 'reselect';
import { EntityId, StateStatus } from '@alycecom/utils';
import { CommonData, User } from '@alycecom/modules';

import { IRootState } from '../../../../store/root.types';
import { ProductFilter } from '../products/products.types';
import { getProductTypeIds } from '../entities/productTypes/productTypes.selectors';
import { PRODUCT_TYPES } from '../entities/productTypes/productTypes.constants';

import { ICustomMarketplaceState } from './customMarketplace.reducer';

const getCustomMarketplaceState = (state: IRootState): ICustomMarketplaceState => state.marketplace.customMarketplace;

export const getIsLoading = pipe(getCustomMarketplaceState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getCustomMarketplaceState, propEq('status', StateStatus.Fulfilled));
export const getIsRejected = pipe(getCustomMarketplaceState, propEq('status', StateStatus.Rejected));
export const getIsBulkLoading = pipe(getCustomMarketplaceState, propEq('bulkStatus', StateStatus.Pending));
export const getCustomMarketplaceErrors = pipe(getCustomMarketplaceState, prop('errors'));
export const getCustomMarketplace = pipe(getCustomMarketplaceState, prop('data'));
export const getDataChangeReason = pipe(getCustomMarketplaceState, prop('dataChangeReason'));
export const getPendingAddProductIds = pipe(getCustomMarketplaceState, prop('pendingAddProductIds'));
export const getPendingRemoveProductIds = pipe(getCustomMarketplaceState, prop('pendingRemoveProductIds'));
export const getPendingProductIds = createSelector(getPendingAddProductIds, getPendingRemoveProductIds, (add, remove) =>
  add.concat(remove),
);
export const getSetOfPendingProductIds = createSelector(getPendingProductIds, ids => new Set(ids));

export const getMarketplaceId = pipe(getCustomMarketplace, prop('id'));
export const getCustomMarketplaceName = pipe(getCustomMarketplace, prop('name'));
export const getCustomMarketplaceCreatedAt = pipe(getCustomMarketplace, prop('createdAt'));
export const getCustomMarketplaceUpdatedAt = pipe<IRootState, ICustomMarketplaceState['data'], string>(
  getCustomMarketplace,
  propOr('', 'updatedAt'),
);
export const getCustomMarketplaceCountryIds = pipe(getCustomMarketplace, prop('countryIds'));
export const getCustomMarketplaceMinPrice = pipe(getCustomMarketplace, prop('minPrice'));
export const getCustomMarketplaceMaxPrice = pipe(getCustomMarketplace, prop('maxPrice'));
export const getCustomMarketplaceDonationPrice = pipe(getCustomMarketplace, prop('donationPrice'));
export const getCustomMarketplaceGiftCardPrice = pipe(getCustomMarketplace, prop('giftCardPrice'));
export const getCustomMarketplaceTeamIds = pipe(getCustomMarketplace, prop('teamIds'));
export const getCustomMarketplaceProductIds = pipe(getCustomMarketplace, prop('productIds'));
export const getCustomMarketplaceProductsCount = pipe(getCustomMarketplaceProductIds, ids => ids.length);
export const getCustomMarketplaceCreatedBy = pipe(getCustomMarketplace, prop('createdBy'));
export const getCustomMarketplaceUpdatedBy = pipe(getCustomMarketplace, prop('updatedBy'));
export const getCustomMarketplaceCampaigns = pipe(getCustomMarketplace, prop('campaignIds'));
export const getIsUserCanEditMarketplace = createSelector(
  User.selectors.getUserCanManageTeams,
  getCustomMarketplaceTeamIds,
  (canEditTeamIds, marketplaceTeamIds) => marketplaceTeamIds.some(id => canEditTeamIds.includes(id)),
);

export const getSetOfAddedProductIds = createSelector(getCustomMarketplaceProductIds, ids => new Set(ids));

export const getCustomMarketplaceSettingsAsFormValues = createSelector(getCustomMarketplace, marketplace => ({
  name: marketplace.name,
  teamIds: marketplace.teamIds,
  countryIds: marketplace.countryIds,
  minPrice: marketplace.minPrice,
  maxPrice: marketplace.maxPrice,
  giftCardPrice: marketplace.giftCardPrice,
  donationPrice: marketplace.donationPrice,
  isGiftCardsAllowed: marketplace.giftCardPrice !== null,
  isDonationsAllowed: marketplace.donationPrice !== null,
  isPhysicalGiftsAllowed: marketplace.minPrice !== null && marketplace.maxPrice !== null,
}));

export const getCustomMarketplaceAsFilters = createSelector(
  getCustomMarketplaceCountryIds,
  getCustomMarketplaceMinPrice,
  getCustomMarketplaceMaxPrice,
  getCustomMarketplaceDonationPrice,
  getCustomMarketplaceGiftCardPrice,
  (countryIds, minPrice, maxPrice, donationPrice, giftCardPrice) => ({
    [ProductFilter.CountryIds]: countryIds,
    [ProductFilter.MinPrice]: minPrice,
    [ProductFilter.MaxPrice]: maxPrice,
    [ProductFilter.DonationPrice]: donationPrice,
    [ProductFilter.GiftCardPrice]: giftCardPrice,
  }),
);

export const getDisabledGiftFilters = createSelector(getMarketplaceId, marketplaceId =>
  marketplaceId
    ? [ProductFilter.MaxPrice, ProductFilter.MinPrice, ProductFilter.DonationPrice, ProductFilter.GiftCardPrice]
    : [],
);

export const getIsPhysicalGiftsAllowed = createSelector(
  getCustomMarketplaceMinPrice,
  getCustomMarketplaceMaxPrice,
  (minPrice, maxPrice) => minPrice !== null && maxPrice !== null,
);

export const getIsDonationsAllowed = createSelector(
  getCustomMarketplaceDonationPrice,
  donationPrice => donationPrice !== null,
);

export const getIsGiftCardsAllowed = createSelector(
  getCustomMarketplaceGiftCardPrice,
  giftCardPrice => giftCardPrice !== null,
);

export const getHiddenGiftFilters = createSelector(
  getMarketplaceId,
  getIsPhysicalGiftsAllowed,
  getIsDonationsAllowed,
  getIsGiftCardsAllowed,
  (marketplaceId, isPhysicalAllowed, isDonationsAllowed, isGiftCardsAllowed) => {
    if (!marketplaceId) {
      return [];
    }
    const filters = [];
    if (!isPhysicalAllowed) {
      filters.push(ProductFilter.MinPrice, ProductFilter.MaxPrice);
    }
    if (!isDonationsAllowed) {
      filters.push(ProductFilter.DonationPrice);
    }
    if (!isGiftCardsAllowed) {
      filters.push(ProductFilter.GiftCardPrice);
    }
    return filters;
  },
);

export const getRestrictedTypeIds = createSelector(
  getIsPhysicalGiftsAllowed,
  getIsDonationsAllowed,
  getIsGiftCardsAllowed,
  getProductTypeIds,
  (isPhysicalAllowed, isDonationsAllowed, isGiftCardsAllowed, typeIds) => {
    let res: EntityId[] = [];

    if (!isPhysicalAllowed) {
      res = without([PRODUCT_TYPES.DONATION, PRODUCT_TYPES.GIFT_CARD], typeIds);
    }
    if (!isDonationsAllowed) {
      res.push(PRODUCT_TYPES.DONATION);
    }
    if (!isGiftCardsAllowed) {
      res.push(PRODUCT_TYPES.GIFT_CARD);
    }
    return res;
  },
);

export const getEnabledTypeIds = createSelector<IRootState, EntityId[], EntityId[], EntityId[]>(
  getRestrictedTypeIds,
  getProductTypeIds,
  without,
);

export const getDefaultTypeIds = createSelector(getProductTypeIds, getEnabledTypeIds, (ids, enabledIds) =>
  ids.length === enabledIds.length ? [] : enabledIds,
);

export const getCustomMarketplaceCountries = createSelector(
  getCustomMarketplaceCountryIds,
  CommonData.selectors.getCommonCountriesMap,
  (countryIds, countries) => countryIds.map(id => countries[id]).filter(country => Boolean(country)),
);
