import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { IWorkatoIntegration } from '../workato.types';
import { TSfConnectionStateResponse } from '../../salesforce/sfOAuth.types';

import { fetchSfConnectionState, fetchWorkatoIntegrations } from './integrations.actions';

const fetchWorkatoIntegrationsEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchWorkatoIntegrations.pending),
    switchMap(() =>
      apiGateway.get(`/marketing/workato/integrations`, null, true).pipe(
        map(({ data }: IResponse<IWorkatoIntegration[]>) => fetchWorkatoIntegrations.fulfilled(data)),
        catchError(handleError(handlers.handleAnyError(fetchWorkatoIntegrations.rejected()))),
      ),
    ),
  );

const fetchSfConnectionStateEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchSfConnectionState.pending),
    switchMap(() =>
      apiGateway.get('/salesforce/connection/state', null, true).pipe(
        map((response: IResponse<TSfConnectionStateResponse>) => fetchSfConnectionState.fulfilled(response.data)),
        catchError(handleError(handlers.handleAnyError(fetchSfConnectionState.rejected()))),
      ),
    ),
  );

export const integrationEpics = [fetchWorkatoIntegrationsEpic, fetchSfConnectionStateEpic];
