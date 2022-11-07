import { createEntityAdapter, StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { clearActivateModuleState } from '../../activate.actions';

import { TProduct } from './defaultGiftProducts.types';
import {
  loadDefaultGiftProductsFail,
  loadDefaultGiftProductsRequest,
  loadDefaultGiftProductsSuccess,
} from './defaultGiftProducts.actions';

export const defaultGiftProductsAdapter = createEntityAdapter<TProduct>();

export const initialDefaultGiftProductsState = defaultGiftProductsAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TDefaultGiftProductsState = typeof initialDefaultGiftProductsState;

export const defaultGiftProducts = createReducer<TDefaultGiftProductsState>({}, initialDefaultGiftProductsState);

defaultGiftProducts.on(clearActivateModuleState, () => ({
  ...initialDefaultGiftProductsState,
}));

defaultGiftProducts.on(loadDefaultGiftProductsRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

defaultGiftProducts.on(loadDefaultGiftProductsSuccess, (state, payload) => ({
  ...state,
  ...defaultGiftProductsAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));

defaultGiftProducts.on(loadDefaultGiftProductsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
