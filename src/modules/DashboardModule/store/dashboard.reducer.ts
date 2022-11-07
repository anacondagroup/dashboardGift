import { combineReducers } from 'redux';

import { IBreakdownsState } from './breakdowns/breakdowns.types';
import { reducer as breakdownsReducer } from './breakdowns/breakdowns.reducer';
import { reducer as membersReducer } from './members/members.reducer';
import { reducer as overviewReducer } from './overview/overview.reducer';

export interface IDashboardState {
  breakdowns: IBreakdownsState;
  // TODO Replace with described state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overview: any;
}

export default combineReducers<IDashboardState>({
  overview: overviewReducer,
  breakdowns: breakdownsReducer,
  members: membersReducer,
});
