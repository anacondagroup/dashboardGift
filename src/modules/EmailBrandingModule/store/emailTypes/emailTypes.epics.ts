import { Epic } from 'redux-observable';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { loadEmailTypesRequest, loadEmailTypesSuccess, loadEmailTypesFail } from './emailTypes.actions';
import { IEmailType } from './emailTypes.types';

export const loadEmailTypesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadEmailTypesRequest),
    debounceTime(300),
    switchMap(() =>
      apiService.get('/api/v1/email-branding/email-types', null, true).pipe(
        map((payload: { data: IEmailType[] }) => loadEmailTypesSuccess(payload.data)),
        catchError(handleError(handlers.handleAnyError(loadEmailTypesFail))),
      ),
    ),
  );

export const emailTypesEpics = [loadEmailTypesEpic];
