import { createAction } from 'redux-act';

import { TGiftLinkSortFilter, TGiftLinksResponse } from './giftLinks.types';

const prefix = 'ACTIVATE/ENTITIES/GIFT_LINKS';

export const fetchGiftLinks = createAction<{ campaignId: number }>(`${prefix}/FETCH_REQUEST`);
export const fetchGiftLinksSuccess = createAction<TGiftLinksResponse>(`${prefix}/FETCH_SUCCESS`);
export const fetchGiftLinksFail = createAction(`${prefix}/FETCH_FAIL`);

export const downloadGiftLinks = createAction<{ campaignId: number }>(`${prefix}/DOWNLOAD_REQUEST`);
export const downloadGiftLinksSuccess = createAction(`${prefix}/DOWNLOAD_SUCCESS`);
export const downloadGiftLinksFail = createAction(`${prefix}/DOWNLOAD_FAIL`);

export const setSearchFilter = createAction<string>(`${prefix}/SET_SEARCH`);
export const setSortFilter = createAction<TGiftLinkSortFilter>(`${prefix}/SET_SEARCH`);

export const resetGiftLinks = createAction(`${prefix}/RESET`);
