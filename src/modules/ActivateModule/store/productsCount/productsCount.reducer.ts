import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { clearActivateModuleState } from '../activate.actions';

import { fetchProductsCount, fetchProductsCountFail, fetchProductsCountSuccess } from './productsCount.actions';

export type TProductsCountState = {
  status: StateStatus;
  count: number;
};

export const initialState = {
  status: StateStatus.Idle,
  count: 0,
};

export const productsCount = createReducer<TProductsCountState>({}, initialState);

productsCount.on(fetchProductsCount, state => ({
  ...state,
  status: StateStatus.Pending,
}));
productsCount.on(fetchProductsCountSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  count: payload.count,
}));
productsCount.on(fetchProductsCountFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

productsCount.on(clearActivateModuleState, () => ({
  ...initialState,
}));
