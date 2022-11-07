import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

const giftBatchesState = (state: IRootState) => state.dashboard.breakdowns.giftBatches;

export const getIsGiftBatchesLoading = pipe(giftBatchesState, state => state.status === StateStatus.Pending);

export const getGiftBatchesList = pipe(giftBatchesState, state => state.giftBatchesList);

export const getGiftBatchesSort = pipe(giftBatchesState, state => state.sort);

export const getGiftBatchesSearch = pipe(giftBatchesState, state => state.search);

export const getTeamCampaignsIdsFilters = pipe(giftBatchesState, state => state.filters);

export const getGiftBatchesPagination = pipe(giftBatchesState, state => state.pagination);
