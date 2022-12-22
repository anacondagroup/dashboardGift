import { combineReducers } from 'redux';

import * as teamBudget from './teamBudget';
import * as teamsManagement from './teamsManagement';
import { TTeamsManagementState } from './teamsManagement';

export type TUiState = {
  [teamBudget.name]: teamBudget.TTeamBudgetState;
  [teamsManagement.name]: TTeamsManagementState;
};

export const ui = combineReducers<TUiState>({
  [teamBudget.name]: teamBudget.reducer,
  [teamsManagement.name]: teamsManagement.reducer,
});
