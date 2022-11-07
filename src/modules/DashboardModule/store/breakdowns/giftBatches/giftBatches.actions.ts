import { createAction } from 'redux-act';
import { createAsyncAction } from '@alycecom/utils';

import { TGiftBatchesPayload, TGiftBatchesFilter, TSort } from './giftBatches.types';

const PREFIX = 'GIFT_BATCHES';

export const getGiftBatches = createAsyncAction<void, TGiftBatchesPayload, void, void>(`${PREFIX}/GET_GIFT_BATCHES`);

export const setTeamsCampaignsIds = createAction<TGiftBatchesFilter>(`${PREFIX}/SET_TEAMS_CAMPAIGNS_IDS`);

export const setGiftBatchesSort = createAction<TSort>(`${PREFIX}/SET_GIFT_BATCHES_SORT`);
export const setGiftBatchesSearch = createAction<string>(`${PREFIX}/SET_GIFT_BATCHES_SEARCH`);
export const setGiftBatchesPagination = createAction<number>(`${PREFIX}/SET_GIFT_BATCHES_PAGINATION`);
