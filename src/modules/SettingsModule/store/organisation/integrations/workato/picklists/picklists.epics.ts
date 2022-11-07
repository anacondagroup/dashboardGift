import { Epic, ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { IWorkatoPicklist } from '../workato.types';

import { fetchWorkatoPicklistByConnection } from './picklists.actions';

const workatoIntegrationPicklistByConnection: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchWorkatoPicklistByConnection.pending),
    mergeMap(({ payload: { connectionUuid, picklistName } }) =>
      apiGateway
        .post(`/marketing/workato/connections/${connectionUuid}/pick-list`, { body: { name: picklistName } }, true)
        .pipe(
          map(({ data }: IResponse<IWorkatoPicklist[]>) =>
            fetchWorkatoPicklistByConnection.fulfilled({ data, name: picklistName }),
          ),
          catchError(handleError(handlers.handleAnyError(fetchWorkatoPicklistByConnection.rejected()))),
        ),
    ),
  );
export const picklistsEpics = [workatoIntegrationPicklistByConnection];
