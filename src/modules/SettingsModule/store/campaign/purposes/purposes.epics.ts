import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { loadPurposesFail, loadPurposesRequest, loadPurposesSuccess } from './purposes.actions';
import { IPurposesOptionsResponse } from './purposes.types';

const loadPurposesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadPurposesRequest),
    switchMap(() =>
      apiService.get(`/api/v1/campaigns/purposes`, null, true).pipe(
        map(({ data }: { data: IPurposesOptionsResponse }) => loadPurposesSuccess(data)),
        catchError(handleError(handlers.handleAnyError(loadPurposesFail))),
      ),
    ),
  );

export const purposesEpics = [loadPurposesEpic];
