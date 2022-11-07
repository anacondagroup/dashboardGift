import { StateStatus } from '@alycecom/utils';
import { pipe } from 'ramda';

import { IRootState } from '../root.types';

const getBudgetUtilizationState = (state: IRootState) => state.budgetUtilization;

export const getTeamBudgetUtilization = pipe(getBudgetUtilizationState, state => state.teamUtilization);
export const getTeamBudgetUtilizationTotal = pipe(getBudgetUtilizationState, state =>
  state.teamUtilization.reduce((prev, curr) => prev + curr.amountClaimed, 0),
);

export const getIsTeamUserBudgetUtilizationLoading = pipe(
  getBudgetUtilizationState,
  state => state.status === StateStatus.Pending,
);

export const getIsTeamBudgetUtilizationLoaded = pipe(
  getBudgetUtilizationState,
  state => state.status === StateStatus.Fulfilled,
);

export const getMembersWithUtilization = pipe(getTeamBudgetUtilization, state =>
  state.filter(member => member.amountClaimed > 0 || member.amountSent > 0).map(member => member.userId),
);
