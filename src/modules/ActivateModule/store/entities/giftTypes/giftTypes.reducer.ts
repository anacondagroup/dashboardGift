import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../activate.actions';

import { IGiftType } from './giftTypes.types';
import { loadGiftTypesRequest, loadGiftTypesSuccess, loadGiftTypesFail } from './giftTypes.actions';

export const giftTypesAdapter = createEntityAdapter<IGiftType>();

export const initialState = giftTypesAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TGiftTypesState = typeof initialState;

export const giftTypes = createReducer({}, initialState);

giftTypes.on(clearActivateModuleState, () => ({
  ...initialState,
}));

giftTypes.on(loadGiftTypesRequest, () => ({
  ...initialState,
  status: StateStatus.Pending,
}));

giftTypes.on(loadGiftTypesSuccess, (state, payload) => ({
  ...state,
  ...giftTypesAdapter.setAll(payload, state),
  status: StateStatus.Fulfilled,
}));

giftTypes.on(loadGiftTypesFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
