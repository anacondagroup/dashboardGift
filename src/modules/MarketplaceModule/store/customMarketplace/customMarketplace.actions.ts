import { createAction } from 'redux-act';

import {
  TCustomMarketplace,
  TCustomMarketplaceCreatePayload,
  TCustomMarketplaceErrors,
} from './customMarketplace.types';

const prefix = `MARKETPLACE/CUSTOM`;

export const createCustomMarketplace = createAction<TCustomMarketplaceCreatePayload>(`${prefix}/CREATE_REQUEST`);
export const createCustomMarketplaceSuccess = createAction<TCustomMarketplace>(`${prefix}/CREATE_SUCCESS`);
export const createCustomMarketplaceFail = createAction<TCustomMarketplaceErrors>(`${prefix}/CREATE_FAIL`);

export const fetchCustomMarketplaceById = createAction<number>(`${prefix}/FETCH_REQUEST`);
export const fetchCustomMarketplaceSuccess = createAction<TCustomMarketplace>(`${prefix}/FETCH_SUCCESS`);
export const fetchCustomMarketplaceFail = createAction(`${prefix}/FETCH_FAIL`);

export const addAllProductsToMarketplace = createAction(`${prefix}/ADD_ALL_PRODUCTS_REQUEST`);
export const addAllProductsToMarketplaceSuccess = createAction(`${prefix}/ADD_ALL_PRODUCTS_SUCCESS`);
export const addAllProductsToMarketplaceFail = createAction<TCustomMarketplaceErrors>(
  `${prefix}/ADD_ALL_PRODUCTS_FAIL`,
);

export const removeAllProductsFromMarketplace = createAction(`${prefix}/REMOVE_ALL_PRODUCTS_REQUEST`);
export const removeAllProductsFromMarketplaceSuccess = createAction(`${prefix}/REMOVE_ALL_PRODUCTS_SUCCESS`);
export const removeAllProductsFromToMarketplaceFail = createAction<TCustomMarketplaceErrors>(
  `${prefix}/REMOVE_ALL_PRODUCTS_FAIL`,
);

export const updateCustomMarketplace = createAction<TCustomMarketplaceCreatePayload & { id: number }>(
  `${prefix}/UPDATE_REQUEST`,
);
export const updateCustomMarketplaceSuccess = createAction<TCustomMarketplace>(`${prefix}/UPDATE_SUCCESS`);
export const updateCustomMarketplaceFail = createAction<TCustomMarketplaceErrors>(`${prefix}/UPDATE_FAIL`);

export const addCustomMarketplaceProduct = createAction<{ productId: number }>(`${prefix}/ADD_PRODUCT_REQUEST`);
export const addCustomMarketplaceProductSuccess = createAction<{ addedProductIds: number[]; updatedAt: string }>(
  `${prefix}/ADD_PRODUCT_SUCCESS`,
);
export const addCustomMarketplaceProductFail = createAction<{ rejectedProductIds: number[] }>(
  `${prefix}/ADD_PRODUCT_FAIL`,
);

export const removeCustomMarketplaceProduct = createAction<{ productId: number }>(`${prefix}/REMOVE_PRODUCT_REQUEST`);
export const removeCustomMarketplaceProductSuccess = createAction<{ removedProductIds: number[]; updatedAt: string }>(
  `${prefix}/REMOVE_PRODUCT_SUCCESS`,
);
export const removeCustomMarketplaceProductFail = createAction<{ rejectedProductIds: number[] }>(
  `${prefix}/REMOVE_PRODUCT_FAIL`,
);

export const resetCustomMarketplace = createAction(`${prefix}/RESET`);
export const resetDataChangeReason = createAction(`${prefix}/REASON_RESET`);
