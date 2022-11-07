import { pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

const getState = (state: IRootState) => state.activate.ui.createPage.marketplaceSettingsSidebar;

export const getIsMarketplaceSettingsSidebarOpened = pipe(getState, state => state.isOpened);
