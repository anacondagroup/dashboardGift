import { createAction } from 'redux-act';

import { IGiftLimitsSort } from '../../../../../../store/campaign/giftLimits/giftLimits.types';

export const setPage = createAction<{ page: number }>('SET_PAGE');
export const setSort = createAction<IGiftLimitsSort>('SET_SORT');
export const setSearch = createAction<{ search: string }>('SET_SEARCH');
export const setIsBulkUpdateDisplay = createAction<{ isBulkUpdateDisplay: boolean }>('SET_BULK_MODAL_DISPLAY');
export const setBulkGiftLimit = createAction<{ bulkGiftLimit: number }>('SET_BULK_GIFT_LIMIT');
export const setBulkPeriod = createAction<{ bulkPeriod: string }>('SET_BULK_PERIOD');
