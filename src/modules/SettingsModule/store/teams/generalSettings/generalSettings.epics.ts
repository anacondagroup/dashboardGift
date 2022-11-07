import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import * as actions from './generalSettings.actions';
import * as selectors from './generalSettings.selectors';
import { IGeneralSettingsChange } from './generalSettings.types';

const getSettingsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(actions.getSettings),
    mergeMap(({ payload: teamId }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${teamId}/settings`, {}, true).pipe(
        map((response: IGeneralSettingsChange) => actions.getSettingsSuccess(response)),
        catchError(errorHandler({ callbacks: actions.getSettingsFail })),
      ),
    ),
  );

const setSettingsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage, errorHandler } }) =>
  action$.pipe(
    ofType(actions.updateSettings),
    withLatestFrom(state$.pipe(map(selectors.getTeamId))),
    mergeMap(([{ payload: changes, meta: teamId }, storeTeamId]) =>
      apiService
        .patch(
          `/enterprise/dashboard/settings/teams/${teamId || storeTeamId}/settings`,
          {
            body: changes,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            actions.updateSettingsSuccess(changes),
            showGlobalMessage({ type: 'success', text: 'Changes saved!' }),
          ]),
          catchError(errorHandler({ callbacks: actions.updateSettingsFail })),
        ),
    ),
  );

export default [getSettingsEpic, setSettingsEpic];
