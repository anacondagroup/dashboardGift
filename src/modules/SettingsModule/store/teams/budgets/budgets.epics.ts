import { handlers } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { convertBudgetToDollars } from '../../../helpers/teamBudget.helpers';

import { loadBudgets } from './budgets.actions';
import { IBudget } from './budgets.types';

export const loadBudgetEpic: Epic = (action$, _, { apiGateway }) =>
  action$.pipe(
    ofType(loadBudgets.pending),
    switchMap(({ payload: { teamIds } }) =>
      forkJoin(
        ...teamIds.map(teamId =>
          apiGateway.get(`/budget/team/${teamId}`, {}, true).pipe(
            catchError(error => {
              // In case budget has yet to be defined for Team and is not found
              // ignore the error
              if (error.status === 404) return of({});

              return error;
            }),
          ),
        ),
      ).pipe(
        map(responses => {
          const fetchedBudgets: IBudget[] = responses
            // Filter our responses w/o data - i.e. any responses with budget not found
            .filter((response: { data: IBudget | {} }) => response.data)
            .map((response: { data: IBudget }) => convertBudgetToDollars(response.data));

          return loadBudgets.fulfilled(fetchedBudgets);
        }),
        catchError(apiGateway.handleError(handlers.handleAnyError(loadBudgets.rejected()))),
      ),
    ),
  );

export const budgetEpics = [loadBudgetEpic];
