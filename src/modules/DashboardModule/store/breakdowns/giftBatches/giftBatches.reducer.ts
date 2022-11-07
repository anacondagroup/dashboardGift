import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';

import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';

import {
  getGiftBatches,
  setGiftBatchesPagination,
  setGiftBatchesSearch,
  setGiftBatchesSort,
  setTeamsCampaignsIds,
} from './giftBatches.actions';
import { TGiftBatches, TPagination, TSort, TGiftBatchesFilter, GiftBatchesTableFields } from './giftBatches.types';

export type TGiftBatchesState = {
  status: StateStatus;
  giftBatchesList: TGiftBatches[];
  filters: TGiftBatchesFilter;
  search?: string;
  sort: TSort;
  pagination: TPagination;
  errors: TErrors;
};

export const initialState: TGiftBatchesState = {
  status: StateStatus.Idle,
  giftBatchesList: [],
  filters: {
    teamIds: [],
    campaignIds: [],
  },
  search: '',
  sort: {
    column: GiftBatchesTableFields.DefaultProduct,
    direction: TABLE_SORT.ASC,
  },
  pagination: {
    perPage: 10,
    currentPage: 0,
    total: 0,
    offset: 0,
  },
  errors: {},
};

export const giftBatches = createReducer({}, initialState);

giftBatches
  .on(getGiftBatches.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(getGiftBatches.fulfilled, (state, payload) => ({
    ...state,
    giftBatchesList: payload.data,
    pagination: {
      ...state.pagination,
      perPage: payload.pagination.limit,
      total: payload.pagination.total,
      offset: payload.pagination.offset,
    },
    status: StateStatus.Fulfilled,
  }))
  .on(getGiftBatches.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))
  .on(setGiftBatchesSort, (state, { column, direction }) => ({
    ...state,
    sort: {
      column,
      direction,
    },
  }))
  .on(setGiftBatchesSearch, (state, payload) => ({
    ...state,
    search: payload,
  }))
  .on(setTeamsCampaignsIds, (state, { teamIds, campaignIds }) => ({
    ...state,
    filters: {
      teamIds,
      campaignIds,
    },
  }))
  .on(setGiftBatchesPagination, (state, payload) => ({
    ...state,
    pagination: {
      ...state.pagination,
      currentPage: payload,
      offset: payload * state.pagination.perPage,
    },
  }));
