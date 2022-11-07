import { omit, pipe, prop, propEq, without } from 'ramda';
import { createSelector } from 'reselect';
import { EntityId, StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';
import { getProductTypeIds, getProductTypesMap } from '../entities/productTypes/productTypes.selectors';
import { getBrandIds, getMerchantIds } from '../entities/productVendors/productVendors.selectors';
import { ProductVendorsTypes } from '../entities/productVendors/productVendors.types';

const getTeamSettingsState = (state: IRootState) => state.marketplace.teamSettings;

export const getTeamSettingsData = pipe(getTeamSettingsState, prop('data'));
export const getTeamId = pipe(getTeamSettingsState, prop('teamId'));
export const getIsLoading = pipe(getTeamSettingsState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getTeamSettingsState, propEq('status', StateStatus.Fulfilled));
export const getIsIdle = pipe(getTeamSettingsState, propEq('status', StateStatus.Idle));
export const getRestrictedTypeIds = pipe(getTeamSettingsData, prop('restrictedProductsTypes'));
export const getRestrictedVendors = pipe(getTeamSettingsData, prop('restrictedProductsVendors'));

export const getRestrictedMerchantIds = createSelector(getRestrictedVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Merchant).map(merchant => merchant.id),
);
export const getRestrictedBrandIds = createSelector(getRestrictedVendors, vendors =>
  vendors.filter(vendor => vendor.type === ProductVendorsTypes.Brand).map(brand => brand.id),
);

export const getAvailableTypes = createSelector(
  getProductTypesMap,
  getRestrictedTypeIds,
  (typesMap, restrictedTypeIds) => Object.values(omit(restrictedTypeIds as string[], typesMap)),
);
export const getAvailableTypeIds = createSelector(getProductTypeIds, getRestrictedTypeIds, (typeIds, restrictedIds) =>
  without(restrictedIds, typeIds),
);

export const makeGetAvailableTypeIdsByCountryId = (countryIds: number[]): ((state: IRootState) => EntityId[]) =>
  createSelector(getProductTypesMap, getAvailableTypeIds, (typesMap, permittedIds) =>
    permittedIds.filter(typeId => typesMap[typeId].countryIds.some(countryId => countryIds.includes(countryId))),
  );

export const makeGetNotAvailableTypeIdsByCountryId = (countryIds: number[]): ((state: IRootState) => EntityId[]) =>
  createSelector(getProductTypeIds, makeGetAvailableTypeIdsByCountryId(countryIds), (typeIds, availableTypeIds) =>
    without(availableTypeIds, typeIds),
  );

/**
 * ! Selectors getAvailableMerchantIds, getAvailableBrandIds are used only for getting actual marketplace filters.
 */
export const getAvailableMerchantIds = createSelector(
  getMerchantIds,
  getRestrictedMerchantIds,
  (merchantIds, restrictedIds) => (restrictedIds.length === 0 ? [] : without(restrictedIds, merchantIds)),
);
export const getAvailableBrandIds = createSelector(getBrandIds, getRestrictedBrandIds, (brandIds, restrictedIds) =>
  restrictedIds.length === 0 ? [] : without(restrictedIds, brandIds),
);

export const getPermittedMerchantIds = createSelector(
  getMerchantIds,
  getRestrictedMerchantIds,
  (merchantIds, restrictedIds) => without(restrictedIds, merchantIds),
);
export const getPermittedBrandIds = createSelector(getBrandIds, getRestrictedBrandIds, (brandIds, restrictedIds) =>
  without(restrictedIds, brandIds),
);
