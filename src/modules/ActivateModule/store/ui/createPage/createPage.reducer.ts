import { combineReducers } from 'redux';

import { contactsSidebar, IContactsSidebarState } from './contactsSidebar';
import { marketplaceSettingsSidebar, IMarketplaceSettingsSidebarState } from './marketplaceSettingsSidebar';
import { marketplaceSidebar, IMarketplaceSidebarState } from './marketplaceSidebar';

export interface ICreatePageState {
  contactsSidebar: IContactsSidebarState;
  marketplaceSettingsSidebar: IMarketplaceSettingsSidebarState;
  marketplaceSidebar: IMarketplaceSidebarState;
}

export const createPage = combineReducers<ICreatePageState>({
  contactsSidebar,
  marketplaceSettingsSidebar,
  marketplaceSidebar,
});
