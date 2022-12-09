import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';

import { TGroupId } from '../../../types';
import { GroupsTeamsConstants } from '../../../constants/groupsTeams.constants';
import { TDateRange } from '../../billing.types';
import { resetBillingUi } from '../ui.actions';

export type TOverviewFiltersState = {
  dateRange: TDateRange;
  groupId: TGroupId;
};

const initialState: TOverviewFiltersState = {
  dateRange: {
    preset: undefined,
    from: moment().utc().startOf('month').format(REQUEST_DATE_FORMAT),
    to: moment().utc().endOf('day').format(REQUEST_DATE_FORMAT),
  },
  groupId: GroupsTeamsConstants.AllGroupsAndTeams,
};

export const {
  name,
  reducer: overviewFilters,
  actions: { setDateRange, setGroupId },
  getInitialState,
} = createSlice({
  name: 'overviewFilters' as const,
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<TDateRange>) =>
      Object.assign(state, {
        dateRange: action.payload,
      }),
    setGroupId: (state, action: PayloadAction<TGroupId>) =>
      Object.assign(state, {
        groupId: action.payload,
      }),
  },
  extraReducers: builder => builder.addCase(resetBillingUi, () => initialState),
});