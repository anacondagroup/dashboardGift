import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import * as actions from './productVendors.actions';
import * as types from './productVendors.types';
import { ProductVendorsTypes } from './productVendors.types';

export const getVendorId = (entity: { type: ProductVendorsTypes; id: number }): string => `${entity.type}/${entity.id}`;
export const productVendorsAdapter = createEntityAdapter<types.TProductVendor>({
  getId: getVendorId,
});

export const initialState = productVendorsAdapter.getInitialState({
  status: StateStatus.Idle,
  campaignId: null as number | null,
  teamIds: null as number[] | null,
});

export type IProductVendorsState = typeof initialState;

export const productVendors = createReducer<IProductVendorsState>({}, initialState);

productVendors.on(actions.fetchProductVendors, (state, payload) => ({
  ...state,
  status: StateStatus.Pending,
  campaignId: payload.campaignId || null,
  teamIds: payload.teamIds || null,
}));

productVendors.on(actions.fetchProductVendorsSuccess, (state, payload) => ({
  ...state,
  ...productVendorsAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));

productVendors.on(actions.fetchProductVendorsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
  campaignId: null,
}));
