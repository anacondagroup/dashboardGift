import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { loadTeamBudgetUtilization } from './budgetUtilization.actions';
import { IBudgetUtilizationByTeam } from './budgetUtilization.types';

export const initialState = {
  status: StateStatus.Idle,
  teamUtilization: [],
};

export type TBudgetUtilizationState = {
  status: StateStatus;
  teamUtilization: IBudgetUtilizationByTeam[];
};

export const reducer = createReducer<TBudgetUtilizationState>({}, initialState);

reducer.on(loadTeamBudgetUtilization.pending, (state, _) => ({
  ...state,
  status: StateStatus.Pending,
}));

reducer.on(loadTeamBudgetUtilization.fulfilled, (state, budgetUtilizations) => ({
  ...state,
  teamUtilization: budgetUtilizations,
  status: StateStatus.Fulfilled,
}));

reducer.on(loadTeamBudgetUtilization.rejected, (state, _) => ({
  ...state,
  teamUtilization: [],
  status: StateStatus.Rejected,
}));
