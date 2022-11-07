import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const getOperationsState = (state: IRootState) => state.billing.operations;

export const getOperations = pipe(getOperationsState, state => state.operations.list);
export const getOperationsIsLoading = pipe(getOperationsState, state => state.operations.isLoading);

export const getDateRange = pipe(getOperationsState, state => state.dateRangeFilter);

export const getTypes = pipe(getOperationsState, state => state.typesFilter.items);
export const getTypesIsLoading = pipe(getOperationsState, state => state.typesFilter.isLoading);
export const getSelectedTypes = pipe(getOperationsState, state => state.typesFilter.selected);

export const getPagination = pipe(getOperationsState, state => state.operations.pagination);

export const getOperationsReportDownloading = pipe(
  getOperationsState,
  state => state.downloadReportStatus === StateStatus.Pending,
);
