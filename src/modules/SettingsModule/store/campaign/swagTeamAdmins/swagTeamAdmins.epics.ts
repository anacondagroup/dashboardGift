import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import { loadSwagTeamAdminsFail, loadSwagTeamAdminsRequest, loadSwagTeamAdminsSuccess } from './swagTeamAdmins.actions';
import { ITeamMember } from './swagTeamAdmins.types';

const loadSwagTeamAdminsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadSwagTeamAdminsRequest),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/swag/admins?teamId=${payload.teamId}`).pipe(
        map(({ members: admins }: { members: ITeamMember[] }) => loadSwagTeamAdminsSuccess({ admins })),
        catchError(
          errorHandler({
            callbacks: loadSwagTeamAdminsFail,
          }),
        ),
      ),
    ),
  );

export default [loadSwagTeamAdminsEpic];
