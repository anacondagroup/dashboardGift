import { createReducer } from 'redux-act';

import { clearActivateModuleState } from '../../../activate.actions';

import { closeMarketplaceSettingsSidebar, openMarketplaceSettingsSidebar } from './marketplaceSettingsSidebar.actions';

export interface IMarketplaceSettingsSidebarState {
  isOpened: boolean;
}

export const initialState: IMarketplaceSettingsSidebarState = {
  isOpened: false,
};

export const marketplaceSettingsSidebar = createReducer({}, initialState);

marketplaceSettingsSidebar.on(clearActivateModuleState, () => ({
  ...initialState,
}));

marketplaceSettingsSidebar.on(openMarketplaceSettingsSidebar, state => ({
  ...state,
  isOpened: true,
}));
marketplaceSettingsSidebar.on(closeMarketplaceSettingsSidebar, state => ({
  ...state,
  isOpened: false,
}));
