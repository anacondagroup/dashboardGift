import { createAction } from 'redux-act';

import { TProduct } from './defaultGiftProducts.types';

const prefix = 'ACTIVATE/ENTITIES/DEFAULT_GIFT_PRODUCTS';

export const loadDefaultGiftProductsRequest = createAction<{ campaignId: number }>(`${prefix}/LOAD_REQUEST`);
export const loadDefaultGiftProductsSuccess = createAction<TProduct[]>(`${prefix}/LOAD_SUCCESS`);
export const loadDefaultGiftProductsFail = createAction(`${prefix}/LOAD_FAIL`);
