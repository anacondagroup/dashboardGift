import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../activate.actions';

import { IGiftVendor } from './giftVendors.types';
import { loadGiftVendorsRequest, loadGiftVendorsSuccess, loadGiftVendorsFail } from './giftVendors.actions';
import { getVendorKey } from './giftVendors.helpers';

export const giftVendorsAdapter = createEntityAdapter<IGiftVendor>({
  getId: getVendorKey,
});

export const initialState = giftVendorsAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TGiftVendorsState = typeof initialState;

export const giftVendors = createReducer({}, initialState);

giftVendors.on(clearActivateModuleState, () => ({
  ...initialState,
}));

giftVendors.on(loadGiftVendorsRequest, () => ({
  ...initialState,
  status: StateStatus.Pending,
}));

giftVendors.on(loadGiftVendorsSuccess, (state, payload) => ({
  ...state,
  ...giftVendorsAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));

giftVendors.on(loadGiftVendorsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
