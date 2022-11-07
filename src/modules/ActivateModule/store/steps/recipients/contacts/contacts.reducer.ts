import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { clearActivateModuleState, loadActivateSuccess } from '../../../activate.actions';
import { isFullActivate } from '../../../activate.types';

import {
  loadContactsFail,
  loadContactsRequest,
  loadContactsSuccess,
  resetStatusMetaData,
  setContactsFilters,
} from './contacts.actions';
import { IContact, IContactsFilters, IContactsMeta, IContactsPagination } from './contacts.types';

interface IAdditionContactsState {
  status: StateStatus;
  sourceType?: string | null;
  marketoComputedUrl: string | null;
  meta?: IContactsMeta;
  filters: IContactsFilters;
  pagination: IContactsPagination;
}

export const defaultContactsFilters: IContactsFilters = {
  search: '',
  sortDirection: 'ASC',
  sortField: 'firstName',
};

export const defaultContactsPagination: IContactsPagination = {
  limit: 20,
  offset: 0,
};

export const contactsAdapter = createEntityAdapter<IContact>();

export const initialContactsState = contactsAdapter.getInitialState<IAdditionContactsState>({
  status: StateStatus.Idle,
  sourceType: undefined,
  marketoComputedUrl: null,
  meta: undefined,
  filters: defaultContactsFilters,
  pagination: defaultContactsPagination,
});
export type IContactsState = typeof initialContactsState;

export const contacts = createReducer({}, initialContactsState);

contacts.on(clearActivateModuleState, () => ({
  ...initialContactsState,
}));

contacts.on(loadActivateSuccess, (state, payload) => ({
  ...state,
  sourceType: isFullActivate(payload) ? payload.recipients.sourceType : null,
  marketoComputedUrl: isFullActivate(payload) ? payload.recipients.marketoComputedUrl : null,
}));

contacts.on(loadContactsRequest, (state, payload) => {
  if (payload.reset) {
    return {
      ...state,
      status: StateStatus.Pending,
      pagination: initialContactsState.pagination,
      filters: initialContactsState.filters,
    };
  }
  return {
    ...state,
    status: StateStatus.Pending,
  };
});
contacts.on(loadContactsSuccess, (state, payload) => {
  const isNewItems = state.pagination.offset === 0;
  return {
    ...state,
    ...(isNewItems ? contactsAdapter.setAll(payload.data, state) : contactsAdapter.addMany(payload.data, state)),
    status: StateStatus.Fulfilled,
    meta: payload.meta,
    pagination: {
      ...state.pagination,
      offset: state.pagination.offset + payload.data.length,
    },
  };
});
contacts.on(loadContactsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

contacts.on(setContactsFilters, (state, payload) => ({
  ...state,
  pagination: {
    ...state.pagination,
    offset: 0,
  },
  filters: {
    ...state.filters,
    ...payload,
  },
}));
contacts.on(resetStatusMetaData, state => ({
  ...state,
  status: StateStatus.Idle,
  meta: undefined,
}));
