import { combineReducers } from 'redux';

import { filters, TRoiFiltersState } from './filters';

export type TRoiState = {
  filters: TRoiFiltersState;
};

export const roi = combineReducers<TRoiState>({
  filters,
});
