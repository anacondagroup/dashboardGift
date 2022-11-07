import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { mergeMap, catchError } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { IGiftResponse } from './giftDeposits.types';
import { addGiftDeposit, addGiftDepositSuccess, addGiftDepositFail } from './giftDeposits.actions';

export const createGiftDeposits: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(addGiftDeposit),
    mergeMap(({ payload }) =>
      apiService.post(`/api/v1/billing/deposits`, { body: payload }).pipe(
        mergeMap(({ success, message }: IGiftResponse) => [
          addGiftDepositSuccess({ success, message }),
          showGlobalMessage({
            type: 'success',
            text: `Gift deposit has been created`,
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              addGiftDepositFail,
              showGlobalMessage({ type: MessageType.Error, text: `Gift deposit hasn't been created` }),
            ),
          ),
        ),
      ),
    ),
  );

export default [createGiftDeposits];
