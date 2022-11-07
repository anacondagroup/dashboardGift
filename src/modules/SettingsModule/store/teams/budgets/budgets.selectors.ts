import { StateStatus } from '@alycecom/utils';
import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { budgetsAdapter } from './budgets.reducer';

const pathToBudgetState = (state: IRootState) => state.settings.teams.budgets;

export const selectors = budgetsAdapter.getSelectors(pathToBudgetState);

export const getIsBudgetLoading = pipe(pathToBudgetState, state => state.status === StateStatus.Pending);

export const getBudgetByTeamId = selectors.getById;
