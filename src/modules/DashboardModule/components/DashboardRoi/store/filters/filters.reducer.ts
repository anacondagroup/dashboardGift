import { createReducer } from 'redux-act';
import { TGlobalRoiFilters } from '@alycecom/services';

import { DEFAULT_ROI_PERIOD, DEFAULT_ROI_PERIOD_NAME } from '../../utils';

import { setRoiFilters } from './filters.actions';

export type TRoiFiltersState = TGlobalRoiFilters & { periodName: string | null };

export const initialState: TRoiFiltersState = {
  period: DEFAULT_ROI_PERIOD,
  periodName: DEFAULT_ROI_PERIOD_NAME,
  teamIds: [],
  campaignIds: [],
  teamMemberIds: [],
};

export const filters = createReducer<TRoiFiltersState>({}, initialState);

filters.on(setRoiFilters, (state, payload) => ({
  ...state,
  ...payload,
}));
