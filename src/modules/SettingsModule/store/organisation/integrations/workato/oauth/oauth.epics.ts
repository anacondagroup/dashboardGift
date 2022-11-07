import { Epic, ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { TWorkatoToken } from '../workato.types';

import { fetchWorkatoIntegrationToken } from './oauth.actions';

const workatoIntegrationTokenEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchWorkatoIntegrationToken.pending),
    mergeMap(({ payload: { connectionId } }) =>
      apiGateway.get('/marketing/workato/jwt', null, true).pipe(
        map(({ data }: IResponse<TWorkatoToken>) =>
          fetchWorkatoIntegrationToken.fulfilled({ connectionId, token: data.token }),
        ),
        catchError(handleError(handlers.handleAnyError(fetchWorkatoIntegrationToken.rejected({ connectionId })))),
      ),
    ),
  );

export const oauthEpics = [workatoIntegrationTokenEpic];
