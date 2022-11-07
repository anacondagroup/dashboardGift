import { createReducer } from 'redux-act';

import { IGiftLimitsSort } from '../../../../../../store/campaign/giftLimits/giftLimits.types';

import {
  setBulkGiftLimit,
  setBulkPeriod,
  setIsBulkUpdateDisplay,
  setPage,
  setSearch,
  setSort,
} from './giftLimitsForm.actions';

export interface IGiftLimitsFormState {
  page: number;
  sort: IGiftLimitsSort;
  search: string;
  isBulkUpdateDisplay: boolean;
  bulkGiftLimit: number;
  bulkPeriod: string;
}

export const giftLimitsFormInitialState = {
  page: 0,
  sort: {
    column: 'user_full_name',
    order: 'asc',
  },
  search: '',
  isBulkUpdateDisplay: false,
  bulkGiftLimit: 0,
  bulkPeriod: 'month',
};

export const giftLimitsForm = createReducer<IGiftLimitsFormState>({}, giftLimitsFormInitialState);

giftLimitsForm
  .on(setPage, (state, { page }) => ({
    ...state,
    page,
  }))
  .on(setSort, (state, { column, order }) => ({
    ...state,
    sort: {
      column,
      order,
    },
  }))
  .on(setSearch, (state, { search }) => ({
    ...state,
    search,
  }))
  .on(setIsBulkUpdateDisplay, (state, { isBulkUpdateDisplay }) => ({
    ...state,
    isBulkUpdateDisplay,
  }))
  .on(setBulkGiftLimit, (state, { bulkGiftLimit }) => ({
    ...state,
    bulkGiftLimit,
  }))
  .on(setBulkPeriod, (state, { bulkPeriod }) => ({
    ...state,
    bulkPeriod,
  }));
