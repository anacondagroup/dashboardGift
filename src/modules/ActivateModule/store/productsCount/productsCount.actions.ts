import { createAction } from 'redux-act';

const prefix = 'ACTIVATE_MODULE/PRODUCTS_COUNT';

export const fetchProductsCount = createAction(`${prefix}/FETCH_REQUEST`);
export const fetchProductsCountSuccess = createAction<{ count: number }>(`${prefix}/FETCH_SUCCESS`);
export const fetchProductsCountFail = createAction(`${prefix}/FETCH_FAIL`);
