import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import { loadSwagTeamsFail, loadSwagTeamsRequest, loadSwagTeamsSuccess } from './swagTeams.actions';
import { ITeamMember } from './swagTeams.types';

const loadSwagTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadSwagTeamsRequest),
    switchMap(() =>
      apiService.get(`/enterprise/swag/teams`).pipe(
        map(({ teams }: { teams: ITeamMember[] }) => loadSwagTeamsSuccess({ teams })),
        catchError(
          errorHandler({
            callbacks: loadSwagTeamsFail,
          }),
        ),
      ),
    ),
  );

export default [loadSwagTeamsEpic];
