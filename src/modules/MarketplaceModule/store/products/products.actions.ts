import { createAction } from 'redux-act';
import { TLegacyErrors } from '@alycecom/services';
import { IProduct } from '@alycecom/ui';

import { IPagination, ISort, IFilters, FilterFieldName } from './products.types';

const PREFIX = 'MARKETPLACE/PRODUCTS';

export const loadProductsSuccess = createAction<{ products: IProduct[]; pagination: IPagination }>(
  `${PREFIX}/LOAD_PRODUCTS_SUCCESS`,
);
export const loadProductsFail = createAction<TLegacyErrors>(`${PREFIX}/LOAD_PRODUCTS_FAIL`);

export const exportProductsRequest = createAction<void>(`${PREFIX}/EXPORT_PRODUCTS_REQUEST`);
export const exportProductsSuccess = createAction<void>(`${PREFIX}/EXPORT_PRODUCTS_SUCCESS`);
export const exportProductsFail = createAction<TLegacyErrors>(`${PREFIX}/EXPORT_PRODUCTS_FAIL`);

export const setLoading = createAction<boolean>(`${PREFIX}/SET_LOADING`);
export const resetProducts = createAction(`${PREFIX}/RESET_PRODUCTS`);

export const setSearch = createAction<string>(`${PREFIX}/SET_SEARCH`);
export const setSorting = createAction<ISort>(`${PREFIX}/SET_SORTING`);
export const setPage = createAction<number>(`${PREFIX}/SET_PAGE_REQUEST`);

export const setFilters = createAction<IFilters>(`${PREFIX}/SET_FILTERS`);
export const updateFilters = createAction<Partial<IFilters>>(`${PREFIX}/UPDATE_FILTERS`);
export const resetFilter = createAction<{ name: FilterFieldName }>(`${PREFIX}/RESET_FILTER`);
export const setDefaultFilters = createAction<Partial<IFilters>>(`${PREFIX}/SET_DEFAULT_FILTERS`);

export const resetProductsState = createAction<void>(`${PREFIX}/RESET_PRODUCTS_STATE`);
