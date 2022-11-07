import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, debounce, takeUntil } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { ofType } from '@alycecom/utils';

import { loadTeamsSettingsFail, loadTeamsSettingsRequest, loadTeamsSettingsSuccess } from './teams.actions';
import { ITeam } from './teams.types';

const loadTeamsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadTeamsSettingsRequest),
    debounce(() => timer(300)),
    mergeMap(() =>
      apiService.get(`/enterprise/dashboard/settings/teams`).pipe(
        map((response: { success: true; teams: ITeam[] }) => loadTeamsSettingsSuccess(response.teams)),
        catchError(error => of(loadTeamsSettingsFail(error))),
        takeUntil(action$.pipe(ofType(loadTeamsSettingsRequest))),
      ),
    ),
  );

export const teamsEpics = [loadTeamsEpic];
