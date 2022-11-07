import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { setNewPasswordFail, setNewPasswordRequest, setNewPasswordSuccess } from './confirmation.actions';

export const setNewPasswordEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(setNewPasswordRequest),
    switchMap(({ payload: { token, password, passwordConfirmation } }) =>
      apiService.post(`/auth/confirmation/${token}/password`, { body: { password, passwordConfirmation } }, true).pipe(
        mergeMap(() => [setNewPasswordSuccess(), push('/login/redirect')]),
        catchError(handleError(handlers.handleAnyError(setNewPasswordFail))),
      ),
    ),
  );

export default [setNewPasswordEpic];
