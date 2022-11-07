import { createReducer } from 'redux-act';
import { IProductDetails } from '@alycecom/ui';

import {
  loadProductDetailsRequest,
  loadProductDetailsSuccess,
  loadProductDetailsFail,
  resetProductDetails,
} from './productDetails.actions';

export interface IProductDetailsState {
  isLoading: boolean;
  product: IProductDetails | undefined;
}

export const initialState: IProductDetailsState = {
  isLoading: false,
  product: undefined,
};

const reducer = createReducer({}, initialState)
  .on(loadProductDetailsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadProductDetailsSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    product: payload,
  }))
  .on(loadProductDetailsFail, state => ({
    ...state,
    isLoading: false,
  }))
  .on(resetProductDetails, state => ({
    ...state,
    ...initialState,
  }));

export default reducer;
