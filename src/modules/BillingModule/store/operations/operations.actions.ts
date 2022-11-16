import { createAction } from 'redux-act';
import { createAsyncAction } from '@alycecom/utils';

import { IOperation } from '../../types';

import { IDateRange, IOperationType, IPagination, TBalance } from './operations.types';

const PREFIX = 'BILLING/OPERATIONS';

export const loadOperationsRequest = createAction(`${PREFIX}/LOAD_OPERATIONS_REQUEST`);
export const loadOperationsSuccess = createAction<{ data: IOperation[]; pagination: IPagination }>(
  `${PREFIX}/LOAD_OPERATIONS_SUCCESS`,
);
export const loadOperationsFail = createAction(`${PREFIX}/LOAD_OPERATIONS_FAIL`);

export const setDateRange = createAction<IDateRange>(`${PREFIX}/SET_DATE_RANGE`);
export const setSelectedTypes = createAction<string[]>(`${PREFIX}/SET_SELECTED_TYPES`);

export const loadTypesRequest = createAction(`${PREFIX}/LOAD_TYPES_REQUEST`);
export const loadTypesSuccess = createAction<IOperationType[]>(`${PREFIX}/LOAD_TYPES_SUCCESS`);
export const loadTypesFail = createAction(`${PREFIX}/LOAD_TYPES_FAIL`);

export const setCurrentPage = createAction<number>(`${PREFIX}/SET_PAGE`);

export const downloadDepositLedgerReportRequest = createAction(`${PREFIX}/DOWNLOAD_OPERATIONS_REPORT_REQUEST`);
export const downloadDepositLedgerReportSuccess = createAction(`${PREFIX}/DOWNLOAD_OPERATIONS_REPORT_SUCCESS`);
export const downloadDepositLedgerReportFail = createAction(`${PREFIX}DOWNLOAD_OPERATIONS_REPORT_FAIL`);

export const fetchBalance = createAsyncAction<void, TBalance>(`${PREFIX}/FETCH_BALANCE`);
