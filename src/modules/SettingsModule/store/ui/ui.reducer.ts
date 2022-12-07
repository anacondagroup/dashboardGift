import { combineReducers } from 'redux';

import * as teamBudget from './teamBudget';

export type TUiState = {
  [teamBudget.name]: teamBudget.TTeamBudgetState;
};

export const ui = combineReducers<TUiState>({
  [teamBudget.name]: teamBudget.reducer,
});
