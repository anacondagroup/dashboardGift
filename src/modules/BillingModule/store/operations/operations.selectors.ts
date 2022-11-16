import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';
import { StateStatus } from '../../../../store/stateStatuses.types';

const getOperationsState = (state: IRootState) => state.billing.operations;

export const getOperations = pipe(getOperationsState, state => state.operations.list);
export const getOperationsIsLoading = pipe(getOperationsState, state => state.operations.isLoading);
export const getHasOperations = pipe(
  getOperationsState,
  state => !state.operations.isLoading && state.operations.list.length > 0,
);

export const getDateRange = pipe(getOperationsState, state => state.dateRangeFilter);

export const getTypes = pipe(getOperationsState, state => state.typesFilter.items);
export const getTypesIsLoading = pipe(getOperationsState, state => state.typesFilter.isLoading);
export const getSelectedTypes = pipe(getOperationsState, state => state.typesFilter.selected);

export const getPagination = pipe(getOperationsState, state => state.operations.pagination);

export const getOperationsReportDownloading = pipe(
  getOperationsState,
  state => state.downloadReportStatus === StateStatus.Pending,
);

export const getBalanceIsLoading = pipe(getOperationsState, state => state.balance.status === StateStatus.Pending);
export const getAmountAtTheStart = pipe(getOperationsState, state => state.balance.amountAtTheStart);
export const getAmountAtTheEnd = pipe(getOperationsState, state => state.balance.amountAtTheEnd);
