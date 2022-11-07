import { createReducer } from 'redux-act';
import { uniqBy, prop } from 'ramda';
import { TLegacyErrors } from '@alycecom/services';
import { IProduct, SORT_MOST_POPULAR } from '@alycecom/ui';

import {
  loadProductsSuccess,
  loadProductsFail,
  setLoading,
  resetProducts,
  setPage,
  setSorting,
  setSearch,
  resetProductsState,
  setFilters,
  resetFilter,
  updateFilters,
  setDefaultFilters,
} from './products.actions';
import { IPagination, ISort, IFilters } from './products.types';

export interface IProductsState {
  isLoading: boolean;
  isLoaded: boolean;
  pagination: IPagination;
  sort: ISort;
  search: string;
  filters: IFilters;
  defaultFilters: Partial<IFilters>;
  hasMore: boolean;
  products: IProduct[];
  errors: TLegacyErrors;
}

export const initialState: IProductsState = {
  isLoading: false,
  isLoaded: false,
  pagination: {
    currentPage: 1,
    perPage: 12,
    total: 0,
    totalPages: 0,
  },
  sort: {
    id: SORT_MOST_POPULAR.id,
    value: SORT_MOST_POPULAR.value,
  },
  search: '',
  filters: {
    brands: [],
    merchants: [],
    categories: [],
    types: [],
    countries: [],
    vendors: [],
  },
  defaultFilters: {},
  hasMore: true,
  products: [],
  errors: {},
};

const reducer = createReducer<IProductsState>({}, initialState);

reducer
  .on(loadProductsSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    products: uniqBy(prop('id'), [...state.products, ...(payload?.products ?? [])]),
    pagination: payload.pagination,
    hasMore: state.pagination.currentPage < payload.pagination.totalPages,
  }))
  .on(loadProductsFail, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    errors: payload,
  }))
  .on(setLoading, (state, payload) => ({
    ...state,
    isLoading: payload,
    isLoaded: !payload,
  }));

reducer
  .on(setSearch, (state, payload) => ({
    ...state,
    search: payload,
  }))
  .on(setSorting, (state, payload) => ({
    ...state,
    sort: payload,
  }))
  .on(setPage, (state, payload) => ({
    ...state,
    isLoading: true,
    pagination: {
      ...state.pagination,
      currentPage: payload,
    },
  }));

reducer
  .on(setFilters, (state, payload) => ({
    ...state,
    filters: payload,
  }))
  .on(updateFilters, (state, payload) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  }))
  .on(resetFilter, (state, { name }) => ({
    ...state,
    filters: {
      ...state.filters,
      [name]: [],
    },
  }));

reducer.on(setDefaultFilters, (state, payload) => ({
  ...state,
  defaultFilters: payload,
}));

reducer.on(resetProducts, state => ({
  ...state,
  pagination: {
    ...initialState.pagination,
    currentPage: 1,
  },
  hasMore: initialState.hasMore,
  products: [],
}));

reducer.on(resetProductsState, () => ({
  ...initialState,
}));

export default reducer;
