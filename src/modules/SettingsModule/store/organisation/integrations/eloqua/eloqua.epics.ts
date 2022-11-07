import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import {
  organisationEloquaIntegrationInfoCheckFail,
  organisationEloquaIntegrationInfoCheckRequest,
  organisationEloquaIntegrationInfoCheckSuccess,
} from './eloqua.actions';
import { IEloquaIntegration } from './eloqua.types';

export const organisationEloquaIntegrationInfoEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(organisationEloquaIntegrationInfoCheckRequest),
    switchMap(() =>
      apiGateway.get('/marketing/eloqua/integrations', null, true).pipe(
        map((response: IEloquaIntegration[]) => organisationEloquaIntegrationInfoCheckSuccess(response[0])),
        catchError(handleError(handlers.handleAnyError(organisationEloquaIntegrationInfoCheckFail))),
      ),
    ),
  );
export const eloquaEpics = [organisationEloquaIntegrationInfoEpic];
