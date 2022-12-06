import { createReducer } from 'redux-act';
import moment from 'moment';

import { IOperation } from '../../types';
import { setSelectedHierarchyId } from '../customerOrg/customerOrg.actions';
import { TDateRange } from '../billing.types';

import { IOperationType, IPagination } from './operations.types';
import {
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
  dateRangeFilter: TDateRange;
  typesFilter: {
    isLoading: boolean;
    items: IOperationType[];
    selected: string[];
  };
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
  dateRangeFilter: {
    from: moment().utc().startOf('month').format('YYYY-MM-DD'),
    to: moment().utc().endOf('day').format('YYYY-MM-DD'),
  },
  typesFilter: {
    isLoading: false,
    items: [],
    selected: [],
  },
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
  }));
