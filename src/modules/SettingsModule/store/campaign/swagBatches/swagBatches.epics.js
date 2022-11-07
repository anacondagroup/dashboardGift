import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST } from './swagBatches.types';
import { swagCodesSettingsAllSettingsFail, swagCodesSettingsAllSettingsSuccess } from './swagBatches.actions';

const loadSwagSettingsCodeBatches = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/swag/campaign/${payload}/batches`).pipe(
        map(response => swagCodesSettingsAllSettingsSuccess({ batches: response.batches, teamId: response.teamId })),
        catchError(error => of(swagCodesSettingsAllSettingsFail(error))),
      ),
    ),
  );

export const swagCodesSettingsEpics = [loadSwagSettingsCodeBatches];
