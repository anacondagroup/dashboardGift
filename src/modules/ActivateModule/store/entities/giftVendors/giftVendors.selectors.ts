import { pipe, prop } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { giftVendorsAdapter } from './giftVendors.reducer';
import { VendorTypes } from './giftVendors.types';

const getGiftVendorsState = (state: IRootState) => state.activate.entities.giftVendors;

const selectors = giftVendorsAdapter.getSelectors(getGiftVendorsState);

export const getStatus = pipe(getGiftVendorsState, prop('status'));
export const getIsGiftVendorsLoading = pipe(getStatus, status => status === StateStatus.Pending);
export const getIsGiftVendorsLoaded = pipe(getStatus, status => status === StateStatus.Fulfilled);
export const getGiftVendorsIds = selectors.getIds;
export const getGiftVendorsMap = selectors.getEntities;
export const getGiftVendors = selectors.getAll;

export const getRestrictedByTeamAmount = createSelector(
  getGiftVendors,
  vendors => vendors.filter(vendor => vendor.isTeamRestricted).length,
);

export const getRestrictedByTeamBrandIds = createSelector(getGiftVendors, vendors =>
  vendors.filter(vendor => vendor.isTeamRestricted && vendor.type === VendorTypes.brand).map(brand => brand.id),
);

export const getRestrictedByTeamMerchantIds = createSelector(getGiftVendors, vendors =>
  vendors
    .filter(vendor => vendor.isTeamRestricted && vendor.type === VendorTypes.merchant)
    .map(merchant => merchant.id),
);
