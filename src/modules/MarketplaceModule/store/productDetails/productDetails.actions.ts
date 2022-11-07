import { createAction } from 'redux-act';
import { IProductDetails, IProductPrice } from '@alycecom/ui';

const PREFIX = 'MARKETPLACE/PRODUCT_DETAILS';

export const loadProductDetailsRequest = createAction<{
  productId: number;
  localPrice?: IProductPrice;
}>(`${PREFIX}/LOAD_PRODUCT_DETAILS_REQUEST`);
export const loadProductDetailsSuccess = createAction<IProductDetails>(`${PREFIX}/LOAD_PRODUCT_DETAILS_SUCCESS`);
export const loadProductDetailsFail = createAction<unknown>(`${PREFIX}/LOAD_PRODUCT_DETAILS_FAIL`);
export const resetProductDetails = createAction<void>(`${PREFIX}/RESET_PRODUCT_DETAILS`);
