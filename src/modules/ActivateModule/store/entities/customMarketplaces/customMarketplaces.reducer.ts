import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../activate.actions';

import * as actions from './customMarketplaces.actions';
import { TShortCustomMarketplace } from './customMarketplaces.types';

export const customMarketplacesAdapter = createEntityAdapter<TShortCustomMarketplace>();

export const initialState = customMarketplacesAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TCustomMarketplacesState = typeof initialState;

export const customMarketplaces = createReducer({}, initialState);

customMarketplaces.on(actions.fetchCustomMarketplaces, state => ({
  ...state,
  status: StateStatus.Pending,
}));
customMarketplaces.on(actions.fetchCustomMarketplacesSuccess, (state, customMarketplacesData) => ({
  ...state,
  ...customMarketplacesAdapter.setAll(customMarketplacesData, state),
  status: StateStatus.Rejected,
}));
customMarketplaces.on(actions.fetchCustomMarketplacesFail, state => ({
  ...state,
  status: StateStatus.Fulfilled,
}));

customMarketplaces.on(clearActivateModuleState, () => initialState);
