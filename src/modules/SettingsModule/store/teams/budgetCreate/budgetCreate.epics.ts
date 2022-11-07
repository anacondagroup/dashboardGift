import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { setTeamSidebarStep } from '../teamOperation/teamOperation.actions';
import { getTeamIds } from '../teams/teams.selectors';
import { loadBudgets } from '../budgets/budgets.actions';
import { convertBudgetToCents } from '../../../helpers/teamBudget.helpers';

import { createBudget, editBudget } from './budgetCreate.actions';

export const createBudgetEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createBudget.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { teamId, data } }, state]) =>
      apiGateway.post(`/budget/team/${teamId}`, { body: { ...convertBudgetToCents(data) } }, true).pipe(
        mergeMap(() => [
          createBudget.fulfilled(),
          setTeamSidebarStep({ step: null, teamId: undefined }),
          loadBudgets({ teamIds: getTeamIds(state) }),
          showGlobalMessage({
            text: `Success! You created a budget for your team.`,
            type: MessageType.Success,
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              createBudget.rejected,
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
            ),
          ),
        ),
      ),
    ),
  );

export const editBudgetEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(editBudget.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { teamId, data } }, state]) =>
      apiGateway.put(`/budget/team/${teamId}`, { body: { ...convertBudgetToCents(data) } }, true).pipe(
        mergeMap(() => [
          editBudget.fulfilled(),
          setTeamSidebarStep({ step: null, teamId: undefined }),
          loadBudgets({ teamIds: getTeamIds(state) }),
          showGlobalMessage({
            text: `Update Saved Succesfully!`,
            type: MessageType.Success,
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              editBudget.rejected,
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
            ),
          ),
        ),
      ),
    ),
  );

export const budgetCreateEpics = [createBudgetEpic, editBudgetEpic];
