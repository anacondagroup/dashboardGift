import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { sendReminder, sendReminderFail, sendReminderSuccess } from './integrationReminders.actions';

export const sendIntegrationReminder: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(sendReminder),
    mergeMap(({ payload }) =>
      apiService
        .post(
          `/api/v1/campaigns/activate/campaigns/${payload.campaignId}/integration-email`,
          {
            body: {
              userId: payload.userId,
            },
          },
          true,
        )
        .pipe(
          map(() => sendReminderSuccess({ ...payload, timestamp: Date.now() })),
          catchError(
            handleError(
              handlers.handleAnyError(sendReminderFail),
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
            ),
          ),
        ),
    ),
  );

export default [sendIntegrationReminder];
