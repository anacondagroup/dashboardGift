import { Epic } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import { updateSettingsSuccess } from '../../modules/SettingsModule/store/teams/generalSettings/generalSettings.actions';

import { loadTeamsFail, loadTeamsRequest, loadTeamsSuccess } from './teams.actions';
import { ITeam } from './teams.types';

const loadTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadTeamsRequest),
    mergeMap(() =>
      apiService.get(`/enterprise/dashboard/teams?includeArchived=true`).pipe(
        map((response: { teams: ITeam[] }) => loadTeamsSuccess(response.teams)),
        catchError(error => errorHandler({ callbacks: loadTeamsFail, message: error.error || '' })(error)),
      ),
    ),
  );

const refreshListOnChangeTeamName: Epic = action$ =>
  action$.pipe(
    ofType(updateSettingsSuccess),
    mergeMap(({ payload: changes }) => (changes.teamName ? [loadTeamsRequest()] : [])),
  );

export default [loadTeamsEpic, refreshListOnChangeTeamName];
