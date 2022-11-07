import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { IBudget } from './budgets.types';
import { loadBudgets } from './budgets.actions';

export const budgetsAdapter = createEntityAdapter<IBudget>({ getId: (entity: IBudget) => entity.teamId });

export const initialState = budgetsAdapter.getInitialState<{ status: StateStatus }>({
  status: StateStatus.Idle,
});

export type TBudgetState = typeof initialState;

export const reducer = createReducer({}, initialState);

reducer.on(loadBudgets.pending, (state, _) => ({
  ...state,
  status: StateStatus.Pending,
}));

reducer.on(loadBudgets.fulfilled, (state, budgets) => ({
  ...state,
  ...budgetsAdapter.setAll(budgets, state),
  status: StateStatus.Fulfilled,
}));

reducer.on(loadBudgets.rejected, (state, _) => ({
  ...state,
  status: StateStatus.Rejected,
}));
