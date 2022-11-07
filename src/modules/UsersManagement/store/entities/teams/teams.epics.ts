import { Epic } from 'redux-observable';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { ITeamExtraData } from '../../usersManagement.types';

import { loadTeamsRequest, loadTeamsSuccess, loadTeamsFail } from './teams.actions';

export const loadTeamsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadTeamsRequest),
    switchMap(() =>
      apiService.get('/api/v1/users/teams', {}, true).pipe(
        map(({ data }: { data: ITeamExtraData[] }) => loadTeamsSuccess(data)),
        catchError(handleError(handlers.handleAnyError(loadTeamsFail))),
      ),
    ),
  );

export const teamsEpics = [loadTeamsEpic];
