import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';
import { GroupsTeamsIdentifier } from '@alycecom/services';
import { SortDirection } from '@alycecom/utils';

import { TDateRange } from '../../billing.types';
import { resetBillingUi } from '../ui.actions';
import { TSortingColumn } from '../../../types';

import { TSorting } from './overviewFilters.types';

export type TOverviewFiltersState = {
  dateRange: TDateRange;
  groupId: string;
  sorting: TSorting<TSortingColumn>;
};

const initialState: TOverviewFiltersState = {
  dateRange: {
    preset: undefined,
    from: moment().utc().startOf('month').format(REQUEST_DATE_FORMAT),
    to: moment().utc().endOf('day').format(REQUEST_DATE_FORMAT),
  },
  groupId: GroupsTeamsIdentifier.AllGroupsAndTeams,
  sorting: {
    column: 'groupName',
    direction: SortDirection.asc,
  },
};

export const {
  name,
  reducer: overviewFilters,
  actions: { setDateRange, setGroupId, setSorting },
  getInitialState,
} = createSlice({
  name: 'overviewFilters' as const,
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<TDateRange>) =>
      Object.assign(state, {
        dateRange: action.payload,
      }),
    setGroupId: (state, action: PayloadAction<string>) =>
      Object.assign(state, {
        groupId: action.payload,
      }),
    setSorting: (state, action: PayloadAction<TSorting>) =>
      Object.assign(state, {
        sorting: action.payload,
      }),
  },
  extraReducers: builder => builder.addCase(resetBillingUi, () => initialState),
});
