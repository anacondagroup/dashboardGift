import { pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

const getState = (state: IRootState) => state.activate.ui.createPage.contactsSidebar;

export const getIsUploadingContactsSidebarOpened = pipe(getState, state => state.isOpened);
export const getContactsSidebarState = pipe(getState, state => state.state);
export const getSourceType = pipe(getState, state => state.source);
