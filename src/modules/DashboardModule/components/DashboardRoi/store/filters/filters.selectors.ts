import { omit, pipe, prop } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

import { TRoiFiltersState } from './filters.reducer';

const getRoiFiltersState = (state: IRootState): TRoiFiltersState => state.roi.filters;

export const getRoiFilters = pipe(getRoiFiltersState, state => omit(['periodName'], state));
export const getRoiCurrentPeriod = pipe(getRoiFiltersState, prop('period'));
export const getRoiCurrentPeriodName = pipe(getRoiFiltersState, prop('periodName'));
export const getRoiCurrentTeams = pipe(getRoiFiltersState, prop('teamIds'));
export const getRoiCurrentCampaigns = pipe(getRoiFiltersState, prop('campaignIds'));
export const getRoiCurrentTeamMembers = pipe(getRoiFiltersState, prop('teamMemberIds'));
