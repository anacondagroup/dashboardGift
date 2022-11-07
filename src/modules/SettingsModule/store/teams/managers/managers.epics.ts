import { Epic } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import { IManagersResponse } from './managers.types';
import { loadManagersRequest, loadManagersSuccess, loadManagersFail } from './managers.actions';

export const loadManagersEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadManagersRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${payload}/managers`).pipe(
        map(({ users }: IManagersResponse) =>
          loadManagersSuccess({
            // eslint-disable-next-line camelcase
            managers: users.map(({ id, full_name }) => ({ id, name: full_name })),
          }),
        ),
        catchError(errorHandler({ callbacks: loadManagersFail })),
      ),
    ),
  );

export const managersEpics = [loadManagersEpic];
