import { createAction } from 'redux-act';

const PREFIX = 'ACTIVATE_MODULE/CREATE_PAGE/MARKETPLACE_SIDEBAR';

export const openMarketplaceSidebar = createAction<number[] | void>(`${PREFIX}/OPEN`);
export const closeMarketplaceSidebar = createAction(`${PREFIX}/CLOSE`);
