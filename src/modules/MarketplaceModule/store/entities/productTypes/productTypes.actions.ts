import { createAction } from 'redux-act';

import { TProductType, TProductTypeCountryIdsFilters } from './productTypes.types';

const prefix = 'MARKETPLACE/PRODUCT_TYPES';

export const fetchProductTypes = createAction<TProductTypeCountryIdsFilters | void>(`${prefix}/FETCH_REQUEST`);
export const fetchProductTypesSuccess = createAction<TProductType[]>(`${prefix}/FETCH_SUCCESS`);
export const fetchProductTypesFail = createAction(`${prefix}/FETCH_FAIL`);
