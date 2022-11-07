import { handlers } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';

import { convertUtilizationsToDollars } from '../../helpers/budget.helpers';

import { loadTeamBudgetUtilization } from './budgetUtilization.actions';
import { IBudgetUtilizationByTeam } from './budgetUtilization.types';

const loadTeamBudgetUtilizationsEpic: Epic = (action$, _, { apiGateway }) =>
  action$.pipe(
    ofType(loadTeamBudgetUtilization.pending),
    switchMap(({ payload: { teamId } }) =>
      apiGateway.get(`/budget/team/${teamId}/membersUtilization`, null, true).pipe(
        map((response: { data: IBudgetUtilizationByTeam[] }) =>
          loadTeamBudgetUtilization.fulfilled(convertUtilizationsToDollars(response.data)),
        ),
        catchError(apiGateway.handleError(handlers.handleAnyError(loadTeamBudgetUtilization.rejected()))),
      ),
    ),
  );
export const budgetUtilizationEpics = [loadTeamBudgetUtilizationsEpic];
