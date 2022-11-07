import { createAction } from 'redux-act';

import { TShortCustomMarketplace } from './customMarketplaces.types';

const prefix = `MARKETPLACE/CUSTOM_MARKETPLACES`;

export const fetchCustomMarketplaces = createAction(`${prefix}/FETCH_REQUEST`);
export const fetchCustomMarketplacesSuccess = createAction<TShortCustomMarketplace[]>(`${prefix}/FETCH_SUCCESS`);
export const fetchCustomMarketplacesFail = createAction(`${prefix}/FETCH_FAIL`);
