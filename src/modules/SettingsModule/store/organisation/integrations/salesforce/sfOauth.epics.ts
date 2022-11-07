import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';
import { ofType } from '@alycecom/utils';

import {
  disconnectFromOAuth,
  errorLoadOAuthFlowLink,
  loadOAuthState,
  loadOAuthStateError,
  loadOAuthStateSuccess,
  startLoadOauthFlowLink,
  successLoadOAuthFlowLink,
} from './sfOauth.actions';
import { IOAuthLinkResponse, IOAuthStateResponse } from './sfOAuth.types';

export const sfOAuthStateEpic: Epic = (action$, state$, { salesforceApiService }) =>
  action$.pipe(
    ofType(loadOAuthState),
    mergeMap(() =>
      salesforceApiService.get('/salesforce/oauth/state', null, true).pipe(
        map((response: IResponse<IOAuthStateResponse>) => loadOAuthStateSuccess(response)),
        catchError(handleError(handlers.handleAnyError(loadOAuthStateError))),
        takeUntil(action$.ofType(loadOAuthState)),
      ),
    ),
  );

export const sfOAuthLinkEpic: Epic = (action$, state$, { salesforceApiService }) =>
  action$.pipe(
    ofType(startLoadOauthFlowLink),
    mergeMap(() =>
      salesforceApiService.get('/salesforce/oauth/flow/start', null, true).pipe(
        map((response: IResponse<IOAuthLinkResponse>) => successLoadOAuthFlowLink(response.data.link)),
        catchError(handleError(handlers.handleAnyError(errorLoadOAuthFlowLink))),
        takeUntil(action$.ofType(startLoadOauthFlowLink)),
      ),
    ),
  );

export const sfDisconnectOAuthEpic: Epic = (action$, state$, { salesforceApiService }) =>
  action$.pipe(
    ofType(disconnectFromOAuth),
    mergeMap(() =>
      salesforceApiService.delete('/salesforce/oauth/flow/disconnect', null, true).pipe(
        map((response: IResponse<IOAuthStateResponse>) => loadOAuthStateSuccess(response)),
        catchError(handleError(handlers.handleAnyError(loadOAuthStateError))),
        takeUntil(action$.ofType(disconnectFromOAuth)),
      ),
    ),
  );
export const sfOauthEpics = [sfOAuthStateEpic, sfOAuthLinkEpic, sfDisconnectOAuthEpic];
