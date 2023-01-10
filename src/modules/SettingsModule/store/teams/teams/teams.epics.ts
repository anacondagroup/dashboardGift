import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { loadTeamsSettingsFail, loadTeamsSettingsRequest, loadTeamsSettingsSuccess } from './teams.actions';
import { ITeam } from './teams.types';

const loadTeamsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadTeamsSettingsRequest),
    switchMap(({ payload: { includeArchived = true } }) =>
      apiService.get(`/enterprise/dashboard/settings/teams?includeArchived=${includeArchived}`).pipe(
        map((response: { success: true; teams: ITeam[] }) => loadTeamsSettingsSuccess(response.teams)),
        catchError(handleError(handlers.handleAnyError(loadTeamsSettingsFail))),
      ),
    ),
  );

export const teamsEpics = [loadTeamsEpic];
