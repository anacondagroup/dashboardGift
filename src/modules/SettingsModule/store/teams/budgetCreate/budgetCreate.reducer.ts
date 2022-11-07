import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { createBudget, resetBudgetCreateData } from './budgetCreate.actions';

export interface IBudgetCreateState {
  status: StateStatus;
  errors: TErrors;
}

export const initialState: IBudgetCreateState = {
  status: StateStatus.Idle,
  errors: {},
};

export const budgetCreate = createReducer({}, initialState);

budgetCreate
  .on(createBudget.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(createBudget.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(createBudget.rejected, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))
  .on(resetBudgetCreateData, () => initialState);
