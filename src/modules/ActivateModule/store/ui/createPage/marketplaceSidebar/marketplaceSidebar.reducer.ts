import { createReducer } from 'redux-act';

import { clearActivateModuleState } from '../../../activate.actions';

import { closeMarketplaceSidebar, openMarketplaceSidebar } from './marketplaceSidebar.actions';

export interface IMarketplaceSidebarState {
  isOpened: boolean;
  selectableCountyIds?: number[];
}

export const initialState: IMarketplaceSidebarState = {
  isOpened: false,
  selectableCountyIds: undefined,
};

export const marketplaceSidebar = createReducer({}, initialState);

marketplaceSidebar.on(clearActivateModuleState, () => ({
  ...initialState,
}));

marketplaceSidebar.on(openMarketplaceSidebar, (state, payload) => ({
  ...state,
  isOpened: true,
  selectableCountyIds: payload || undefined,
}));
marketplaceSidebar.on(closeMarketplaceSidebar, () => ({
  ...initialState,
}));
