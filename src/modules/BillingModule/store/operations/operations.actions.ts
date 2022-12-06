import { createAction } from 'redux-act';

import { IOperation } from '../../types';
import { TDateRange } from '../billing.types';

import { IOperationType, IPagination } from './operations.types';

const PREFIX = 'BILLING/OPERATIONS';

export const loadOperationsRequest = createAction(`${PREFIX}/LOAD_OPERATIONS_REQUEST`);
export const loadOperationsSuccess = createAction<{ data: IOperation[]; pagination: IPagination }>(
  `${PREFIX}/LOAD_OPERATIONS_SUCCESS`,
);
export const loadOperationsFail = createAction(`${PREFIX}/LOAD_OPERATIONS_FAIL`);

export const setDateRange = createAction<TDateRange>(`${PREFIX}/SET_DATE_RANGE`);
export const setSelectedTypes = createAction<string[]>(`${PREFIX}/SET_SELECTED_TYPES`);
export const setCurrentPage = createAction<number>(`${PREFIX}/SET_PAGE`);

export const loadTypesRequest = createAction(`${PREFIX}/LOAD_TYPES_REQUEST`);
export const loadTypesSuccess = createAction<IOperationType[]>(`${PREFIX}/LOAD_TYPES_SUCCESS`);
export const loadTypesFail = createAction(`${PREFIX}/LOAD_TYPES_FAIL`);
