import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  handleError,
  handlers,
  ILegacyResponseError,
  IResponse,
  MessageType,
  TAnyResponseError,
} from '@alycecom/services';

import { IWorkatoConnection } from '../workato.types';

import { fetchWorkatoConnectionsByIntegration } from './connections.actions';

const workatoIntegrationConnectionsByIntegrationEpic: Epic = (
  action$,
  state$,
  { apiGateway, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(fetchWorkatoConnectionsByIntegration.pending),
    switchMap(({ payload: { integrationId } }) =>
      apiGateway.get(`/marketing/workato/integrations/${integrationId}/connections`, null, true).pipe(
        map(({ data }: IResponse<IWorkatoConnection[]>) =>
          fetchWorkatoConnectionsByIntegration.fulfilled({ data, integrationId }),
        ),
        catchError(
          handleError(
            handlers.handleAnyError(
              fetchWorkatoConnectionsByIntegration.rejected(),
              (_: unknown, error: TAnyResponseError) =>
                showGlobalMessage({
                  type: MessageType.Error,
                  text: (error as ILegacyResponseError).message || 'Error fetching connections',
                }),
            ),
          ),
        ),
      ),
    ),
  );

export const connectionsEpics = [workatoIntegrationConnectionsByIntegrationEpic];
