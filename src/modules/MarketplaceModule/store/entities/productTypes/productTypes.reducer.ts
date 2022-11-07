import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import * as actions from './productTypes.actions';
import { TProductType, TProductTypeCountryIdsFilters } from './productTypes.types';

export const productTypesAdapter = createEntityAdapter<TProductType>();

export const initialState = productTypesAdapter.getInitialState<{
  status: StateStatus;
  countryIdsFilters: TProductTypeCountryIdsFilters | null;
}>({
  status: StateStatus.Idle,
  countryIdsFilters: null,
});

export type IProductTypesState = typeof initialState;

export const productTypes = createReducer<IProductTypesState>({}, initialState);

productTypes.on(actions.fetchProductTypes, (state, payload) => ({
  ...state,
  status: StateStatus.Pending,
  countryIdsFilters: payload || null,
}));

productTypes.on(actions.fetchProductTypesSuccess, (state, payload) => ({
  ...state,
  ...productTypesAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));

productTypes.on(actions.fetchProductTypesFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
