import { createAsyncAction } from '@alycecom/utils';
import { TErrors } from '@alycecom/services';
import { createAction } from 'redux-act';

import { TBudgetCreateParams } from './budgetCreate.types';

const PREFIX = 'TEAM_MANAGEMENT/BUDGET_CREATE';

export const createBudget = createAsyncAction<{ data: TBudgetCreateParams; teamId: number }, void, TErrors>(
  'TEAM_SETTINGS/BUDGET_CREATE',
);

export const editBudget = createAsyncAction<{ data: TBudgetCreateParams; teamId: number }, void, TErrors>(
  'TEAM_SETTINGS/BUDGET_EDIT',
);

export const resetBudgetCreateData = createAction(`${PREFIX}/RESET_BUDGET_CREATE_DATA`);
