import { createAction } from 'redux-act';

const PREFIX = 'ACTIVATE_MODULE/CREATE_PAGE/MARKETPLACE_SETTINGS_SIDEBAR';

export const openMarketplaceSettingsSidebar = createAction(`${PREFIX}/OPEN`);
export const closeMarketplaceSettingsSidebar = createAction(`${PREFIX}/CLOSE`);
