import { createAction } from 'redux-act';

import { TProductCategory } from './productCategories.types';

const prefix = `MARKETPLACE/PRODUCT_CATEGORIES`;

export const fetchProductCategories = createAction(`${prefix}/FETCH_REQUEST`);
export const fetchProductCategoriesSuccess = createAction<TProductCategory[]>(`${prefix}/FETCH_SUCCESS`);
export const fetchProductCategoriesFail = createAction(`${prefix}/FETCH_FAIL`);
