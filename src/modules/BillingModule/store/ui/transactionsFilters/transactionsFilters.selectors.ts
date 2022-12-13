import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { TTransactionsFiltersState, name } from './transactionsFilters.reducer';

const getTransactionsFiltersState = (state: IRootState): TTransactionsFiltersState => state.billing.ui[name];

export const getDateRange = pipe(getTransactionsFiltersState, state => state.dateRange);
export const getTransactionTypeIds = pipe(getTransactionsFiltersState, state => state.transactionTypeIds);
export const getPagination = pipe(getTransactionsFiltersState, state => state.pagination);
export const getSelectedHierarchyId = pipe(getTransactionsFiltersState, state => state.selectedHierarchyId);
