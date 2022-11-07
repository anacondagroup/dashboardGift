import { createReducer } from 'redux-act';
import { TGlobalRoiFilters } from '@alycecom/services';

import { DEFAULT_ROI_PERIOD } from '../../utils';

import { setRoiFilters } from './filters.actions';

export type TRoiFiltersState = TGlobalRoiFilters;

export const initialState: TRoiFiltersState = {
  period: DEFAULT_ROI_PERIOD,
  teamIds: [],
  campaignIds: [],
  teamMemberIds: [],
};

export const filters = createReducer<TRoiFiltersState>({}, initialState);

filters.on(setRoiFilters, (state, payload) => ({
  ...state,
  ...payload,
}));
