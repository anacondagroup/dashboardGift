import { catchError, mergeMap, debounce } from 'rxjs/operators';
import { timer } from 'rxjs';
import { handleError, handlers, TrackEvent } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';

import { IPermissionsResponse } from './permissions.types';
import { fetchPermissions } from './permissions.actions';
import { getUserRole } from './permissions.helpers';

export const fetchPermissionsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchPermissions.pending),
    debounce(() => timer(300)),
    mergeMap(() =>
      apiService.get('/enterprise/dashboard/permissions').pipe(
        mergeMap((response: IPermissionsResponse) => [
          TrackEvent.actions.addUserProperties({
            permissions: response.permissions,
            userRole: getUserRole(response.permissions),
          }),
          fetchPermissions.fulfilled(response),
        ]),
        catchError(handleError(handlers.handleAnyError(fetchPermissions.rejected()))),
      ),
    ),
  );

export const permissionsEpics = [fetchPermissionsEpic];
