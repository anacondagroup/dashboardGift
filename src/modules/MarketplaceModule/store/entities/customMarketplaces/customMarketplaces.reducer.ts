import { createReducer } from 'redux-act';
import { createEntityAdapter } from '@alycecom/utils';

import * as actions from './customMarketplaces.actions';
import { TShortCustomMarketplace } from './customMarketplaces.types';

export const customMarketplacesAdapter = createEntityAdapter<TShortCustomMarketplace>();

export const initialState = customMarketplacesAdapter.getInitialState({
  isLoading: false,
  isLoaded: false,
});

export type ICustomMarketplacesState = typeof initialState;

export const customMarketplaces = createReducer({}, initialState);

customMarketplaces.on(actions.fetchCustomMarketplaces, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
}));
customMarketplaces.on(actions.fetchCustomMarketplacesSuccess, (state, customMarketplacesData) => ({
  ...state,
  ...customMarketplacesAdapter.setAll(customMarketplacesData, state),
  isLoaded: true,
  isLoading: false,
}));
customMarketplaces.on(actions.fetchCustomMarketplacesFail, state => ({
  ...state,
  isLoading: false,
  isLoaded: false,
}));
