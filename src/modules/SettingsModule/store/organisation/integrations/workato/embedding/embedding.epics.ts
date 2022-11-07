import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { TWorkatoToken } from '../workato.types';

import { fetchWorkatoEmbeddingToken } from './embedding.actions';

const workatoIntegrationEmbeddingTokenEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchWorkatoEmbeddingToken.pending),
    switchMap(() =>
      apiGateway.get('/marketing/workato/member/jwt', null, true).pipe(
        map(({ data }: IResponse<TWorkatoToken>) => fetchWorkatoEmbeddingToken.fulfilled(data)),
        catchError(handleError(handlers.handleAnyError(fetchWorkatoEmbeddingToken.rejected()))),
      ),
    ),
  );

export const embeddingEpics = [workatoIntegrationEmbeddingTokenEpic];
