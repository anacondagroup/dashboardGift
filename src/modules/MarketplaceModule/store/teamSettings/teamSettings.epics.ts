import { ofType } from '@alycecom/utils';
import { catchError, switchMap, map } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';
import { Epic } from 'redux-observable';

import { fetchTeamSettings, fetchTeamSettingsFail, fetchTeamSettingsSuccess } from './teamSettings.actions';
import { TTeamSettingsData } from './teamSettings.types';

export const fetchTeamSettingsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchTeamSettings),
    switchMap(({ payload: { teamId } }) =>
      apiService.get(`/api/v1/teams/${teamId}/settings`, null, true).pipe(
        map((response: IResponse<TTeamSettingsData>) => fetchTeamSettingsSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(fetchTeamSettingsFail))),
      ),
    ),
  );

export default [fetchTeamSettingsEpic];
