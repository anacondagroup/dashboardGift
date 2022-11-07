import { createAction } from 'redux-act';

import { TProductVendor } from './productVendors.types';

const prefix = 'MARKETPLACE/PRODUCT_VENDORS';

export const fetchProductVendors = createAction(
  `${prefix}/FETCH_REQUEST`,
  ({ campaignId, teamIds }: { campaignId?: number; teamIds?: number[] } | void = {}) => ({ campaignId, teamIds }),
);
export const fetchProductVendorsSuccess = createAction<TProductVendor[]>(`${prefix}/FETCH_SUCCESS`);
export const fetchProductVendorsFail = createAction(`${prefix}/FETCH_FAIL`);
