import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers, handleError, MessageType } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { getDetailsData } from '../details/details.selectors';

import { updateDraftSwagMessaging } from './messaging.actions';

const updatedDraftSwagMessagingEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateDraftSwagMessaging.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { draftId, ...body } }, state]) =>
      apiService
        .put(`/api/v1/campaigns/swag/drafts/${draftId}/messaging`, { body: { ...body.messageData } }, true)
        .pipe(
          mergeMap(() => [
            updateDraftSwagMessaging.fulfilled(body),
            showGlobalMessage({
              type: MessageType.Success,
              text: `"${getDetailsData(state)?.campaignName}" updated successfully!`,
            }),
            goToNextStep(),
          ]),
          catchError(handleError(handlers.handleAnyError(updateDraftSwagMessaging.rejected))),
        ),
    ),
  );

export default [updatedDraftSwagMessagingEpic];
