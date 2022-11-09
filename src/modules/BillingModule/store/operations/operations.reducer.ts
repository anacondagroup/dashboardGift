import { createReducer } from 'redux-act';
import moment from 'moment';

import { StateStatus } from '../../../../store/stateStatuses.types';
import { IOperation } from '../../types';
import { setSelectedAccount } from '../customerOrg/customerOrg.actions';
import { OperationType } from '../../constants/operations.constants';

import { IDateRange, IOperationType, IPagination } from './operations.types';
import {
  loadGiftWithdrawalOnDateRange,
  loadOperationsFail,
  loadOperationsRequest,
  loadOperationsSuccess,
  loadTypesFail,
  loadTypesRequest,
  loadTypesSuccess,
  setDateRange,
  setSelectedTypes,
  setCurrentPage,
  downloadDepositLedgerReportRequest,
  downloadDepositLedgerReportSuccess,
  downloadDepositLedgerReportFail,
} from './operations.actions';

export interface IOperationsState {
  operations: {
    isLoading: boolean;
    totalWithdrawalsOnPage: number;
    totalWithdrawalOnDateRange: number;
    list: IOperation[];
    pagination: IPagination;
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
    totalWithdrawalsOnPage: 0,
    totalWithdrawalOnDateRange: 0,
    list: [],
    pagination: {
      total: 0,
      perPage: 25,
      currentPage: 1,
      totalPages: 0,
    },
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
  .on(loadOperationsSuccess, (state, payload) => {
    const totalWithdrawalsOnPage = payload.data.reduce((total, operation) => {
      if (operation.typeId === OperationType.GiftingWithdrawal) {
        return (total * 100 + Math.abs(operation.amount.amount) * 100) / 100;
      }
      return total;
    }, 0);
    return {
      ...state,
      operations: {
        ...state.operations,
        isLoading: false,
        list: payload.data,
        pagination: payload.pagination,
        totalWithdrawalsOnPage,
      },
    };
  })
  .on(loadOperationsFail, state => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: false,
    },
  }))
  .on(loadGiftWithdrawalOnDateRange.pending, state => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: true,
    },
  }))
  .on(loadGiftWithdrawalOnDateRange.fulfilled, (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: false,
      totalWithdrawalOnDateRange:
        payload?.data[0]?.giftingWithdrawalTotal?.reduce(
          (acc, accountInfo) => (acc * 100 + Math.abs(accountInfo.money.amount) * 100) / 100,
          0,
        ) || 0,
    },
  }))
  .on(loadGiftWithdrawalOnDateRange.rejected, state => ({
    ...state,
    operations: {
      ...state.operations,
      isLoading: false,
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
  .on(setSelectedAccount, state => ({
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
