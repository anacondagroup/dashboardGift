import { createReducer } from 'redux-act';
import { SortDirection, SortDirectionType } from 'react-virtualized';

import { FilterKeys, VendorsOptions } from '../../../../constants/marketplaceSidebar.constants';

import { setVendorsOption, setFilter, setSearch, setSorting } from './allowedVendors.actions';

export interface IAllowedVendorsState {
  search: string;
  sortDirection: SortDirectionType;
  filter: FilterKeys;
  vendorsOption: VendorsOptions;
}

export const initialState = {
  search: '',
  sortDirection: SortDirection.ASC,
  filter: FilterKeys.all,
  vendorsOption: VendorsOptions.all,
};

export const allowedVendors = createReducer<IAllowedVendorsState>({}, initialState);

allowedVendors
  .on(setVendorsOption, (state, { vendorsOption }) => ({
    ...state,
    vendorsOption,
  }))
  .on(setSearch, (state, { search }) => ({
    ...state,
    search,
  }))
  .on(setSorting, (state, { direction: sortDirection }) => ({
    ...state,
    sortDirection,
  }))
  .on(setFilter, (state, { filter }) => ({
    ...state,
    filter,
  }));
