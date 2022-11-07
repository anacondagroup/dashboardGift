import { pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

const getState = (state: IRootState) => state.activate.ui.createPage.marketplaceSidebar;

export const getIsMarketplaceSidebarOpened = pipe(getState, state => state.isOpened);
export const getSelectableCountyIds = pipe(getState, state => state.selectableCountyIds);
