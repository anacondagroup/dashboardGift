import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { TOverviewFiltersState, name } from './overviewFilters.reducer';

const getOverviewFiltersState = (state: IRootState): TOverviewFiltersState => state.billing.ui[name];

export const getDateRange = pipe(getOverviewFiltersState, state => state.dateRange);
export const getGroupId = pipe(getOverviewFiltersState, state => state.groupId);
export const getSorting = pipe(getOverviewFiltersState, state => state.sorting);
