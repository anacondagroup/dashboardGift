import { propEq, pipe } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { IProductVendorsState, productVendorsAdapter } from './productVendors.reducer';
import { ProductVendorsTypes } from './productVendors.types';

export const getProductVendorsState = (state: IRootState): IProductVendorsState =>
  state.marketplace.entities.productVendors;

const selectors = productVendorsAdapter.getSelectors(getProductVendorsState);

export const getIsLoading = pipe(getProductVendorsState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getProductVendorsState, propEq('status', StateStatus.Fulfilled));
export const getIsIdle = pipe(getProductVendorsState, propEq('status', StateStatus.Idle));

export const getVendorsMap = selectors.getEntities;
export const getVendors = selectors.getAll;
export const getVendorsIds = selectors.getIds;

export const getBrands = createSelector(getVendors, vendor => vendor.filter(v => v.type === ProductVendorsTypes.Brand));
export const getBrandIds = createSelector(getBrands, brands => brands.map(brand => brand.id));

export const getMerchants = createSelector(getVendors, vendor =>
  vendor.filter(v => v.type === ProductVendorsTypes.Merchant),
);
export const getMerchantIds = createSelector(getMerchants, merchants => merchants.map(merchant => merchant.id));
