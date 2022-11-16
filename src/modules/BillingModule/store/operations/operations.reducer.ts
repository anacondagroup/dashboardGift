import { createReducer } from 'redux-act';
import moment from 'moment';

import { StateStatus } from '../../../../store/stateStatuses.types';
import { IOperation } from '../../types';
import { setSelectedHierarchyId } from '../customerOrg/customerOrg.actions';

import { IDateRange, IOperationType, IPagination } from './operations.types';
import {
  downloadDepositLedgerReportFail,
  downloadDepositLedgerReportRequest,
  downloadDepositLedgerReportSuccess,
  fetchBalance,
  loadOperationsFail,
  loadOperationsRequest,
  loadOperationsSuccess,
  loadTypesFail,
  loadTypesRequest,
  loadTypesSuccess,
  setCurrentPage,
  setDateRange,
  setSelectedTypes,
} from './operations.actions';

export interface IOperationsState {
  operations: {
    isLoading: boolean;
    list: IOperation[];
    pagination: IPagination;
  };
  balance: {
    status: StateStatus;
    amountAtTheStart: number;
    amountAtTheEnd: number;
  };
  dateRangeFilter: IDateRange;
  typesFilter: {
    isLoading: boolean;
    items: IOperationType[];
    selected: string[];
  };
  downloadReportStatus: StateStatus;
}

export const initialState: IOperationsState = {
  operations: {
    isLoading: false,
    list: [],
    pagination: {
      total: 0,
      perPage: 25,
      currentPage: 1,
      totalPages: 0,
    },
  },
  balance: {
    status: StateStatus.Idle,
    amountAtTheStart: 0,
    amountAtTheEnd: 0,
  },
  dateRangeFilter: {
    from: moment().utc().startOf('month').format('YYYY-MM-DD'),
    to: moment().utc().endOf('day').format('YYYY-MM-DD'),
  },
  typesFilter: {
    isLoading: false,
    items: [],
    selected: [],
  },
  downloadReportStatus: StateStatus.Idle,
};

export const operations = createReducer({}, initialState)
  .on(loadOperationsRequest, state => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: true,
    },
  }))
  .on(loadOperationsSuccess, (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: false,
      list: payload.data,
      pagination: payload.pagination,
    },
  }))
  .on(loadOperationsFail, state => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: false,
    },
  }))
  .on(fetchBalance.pending, state => ({
    ...state,
    balance: {
      ...state.balance,
      status: StateStatus.Pending,
    },
  }))
  .on(fetchBalance.fulfilled, (state, { amountAtTheStart, amountAtTheEnd }) => ({
    ...state,
    balance: {
      status: StateStatus.Fulfilled,
      amountAtTheStart,
      amountAtTheEnd,
    },
  }))
  .on(fetchBalance.rejected, state => ({
    ...state,
    balance: {
      ...state.balance,
      status: StateStatus.Rejected,
    },
  }))
  .on(setDateRange, (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      pagination: initialState.operations.pagination,
    },
    dateRangeFilter: payload,
  }))
  .on(setSelectedTypes, (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      pagination: initialState.operations.pagination,
    },
    typesFilter: {
      ...state.typesFilter,
      selected: payload,
    },
  }))

  .on(loadTypesRequest, state => ({
    ...state,
    typesFilter: {
      ...state.typesFilter,
      isLoading: true,
    },
  }))
  .on(loadTypesSuccess, (state, payload) => ({
    ...state,
    typesFilter: {
      ...state.typesFilter,
      isLoading: false,
      items: payload,
      selected: payload.map(({ id }) => id),
    },
  }))
  .on(loadTypesFail, state => ({
    ...state,
    typesFilter: {
      ...state.typesFilter,
      isLoading: false,
    },
  }))
  .on(setSelectedHierarchyId, state => ({
    ...state,
    operations: {
      ...state.operations,
      pagination: initialState.operations.pagination,
    },
  }))
  .on(setCurrentPage, (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      pagination: {
        ...state.operations.pagination,
        currentPage: payload,
      },
    },
  }))

  .on(downloadDepositLedgerReportRequest, state => ({
    ...state,
    downloadReportStatus: StateStatus.Pending,
  }))
  .on(downloadDepositLedgerReportSuccess, state => ({
    ...state,
    downloadReportStatus: StateStatus.Fulfilled,
  }))
  .on(downloadDepositLedgerReportFail, state => ({
    ...state,
    downloadReportStatus: StateStatus.Rejected,
  }));
