import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';
import { appApi, TBillingPagination, GroupsTeamsIdentifier } from '@alycecom/services';

import { TDateRange } from '../../billing.types';
import { resetBillingUi } from '../ui.actions';

import { makeGroupHierarchyId } from './transactionsFilters.helpers';

export type TTransactionsFiltersState = {
  selectedHierarchyId: string;
  transactionTypeIds: string[];
  dateRange: TDateRange;
  pagination: TBillingPagination;
};

const initialState: TTransactionsFiltersState = {
  selectedHierarchyId: makeGroupHierarchyId(GroupsTeamsIdentifier.AllGroupsAndTeams),
  transactionTypeIds: [],
  dateRange: {
    preset: undefined,
    from: moment().utc().startOf('month').format(REQUEST_DATE_FORMAT),
    to: moment().utc().endOf('day').format(REQUEST_DATE_FORMAT),
  },
  pagination: {
    total: 0,
    perPage: 25,
    currentPage: 1,
  },
};

export const {
  name,
  reducer: transactionsFilters,
  actions: { setDateRange, setTransactionTypeIds, setSelectedHierarchyId, setCurrentPage },
  getInitialState,
} = createSlice({
  name: 'transactionsFilters' as const,
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<TDateRange>) =>
      Object.assign(state, {
        dateRange: action.payload,
        pagination: {
          ...state.pagination,
          currentPage: 1,
        },
      }),
    setTransactionTypeIds: (state, action: PayloadAction<string[]>) =>
      Object.assign(state, {
        transactionTypeIds: action.payload,
        pagination: {
          ...state.pagination,
          currentPage: 1,
        },
      }),
    setSelectedHierarchyId: (state, action: PayloadAction<string>) =>
      Object.assign(state, {
        selectedHierarchyId: action.payload,
        pagination: {
          ...state.pagination,
          currentPage: 1,
        },
      }),
    setCurrentPage: (state, action: PayloadAction<number>) =>
      Object.assign(state, {
        pagination: {
          ...state.pagination,
          currentPage: action.payload,
        },
      }),
  },
  extraReducers: builder =>
    builder
      .addCase(resetBillingUi, state =>
        Object.assign(state, {
          ...initialState,
          transactionTypeIds: state.transactionTypeIds,
        }),
      )
      .addMatcher(appApi.endpoints.getTransactionTypes.matchFulfilled, (state, { payload }) =>
        Object.assign(state, {
          transactionTypeIds: payload?.map(type => type.id),
        }),
      )
      .addMatcher(appApi.endpoints.getTransactions.matchFulfilled, (state, { payload }) =>
        Object.assign(state, {
          pagination: payload.pagination,
        }),
      ),
});
