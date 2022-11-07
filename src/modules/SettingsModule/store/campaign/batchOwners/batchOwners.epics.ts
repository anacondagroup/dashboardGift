import { Epic } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import {
  loadGeneralSettingsBatchOwnersRequest,
  loadGeneralSettingsBatchOwnersSuccess,
  loadGeneralSettingsBatchOwnersFail,
} from './batchOwners.actions';

const loadBatchOwnersEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadGeneralSettingsBatchOwnersRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/swag/campaign/${payload}/batch-owners`).pipe(
        mergeMap(({ members }) => [loadGeneralSettingsBatchOwnersSuccess(members)]),
        catchError(errorHandler({ callbacks: loadGeneralSettingsBatchOwnersFail })),
      ),
    ),
  );

export const campaignSettingsBatchOwnersEpics = [loadBatchOwnersEpic];
