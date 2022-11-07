import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { mergeMap, map, catchError, takeUntil } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import * as actions from './rightToBeForgotten.actions';

const sendRightToBeForgottenEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.sendRightToBeForgotten),
    mergeMap(({ payload }) =>
      apiService
        .post(
          '/api/v1/security/right-to-be-forgotten-request',
          {
            body: payload,
          },
          true,
        )
        .pipe(
          map(() => actions.sendRightToBeForgottenSuccess()),
          catchError(handleError(handlers.handleAnyError(actions.sendRightToBeForgottenFail))),
          takeUntil(action$.pipe(ofType(actions.sendRightToBeForgotten))),
        ),
    ),
  );

export default [sendRightToBeForgottenEpic];
