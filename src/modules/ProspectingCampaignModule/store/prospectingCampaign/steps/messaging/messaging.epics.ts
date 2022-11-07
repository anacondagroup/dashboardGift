import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { getDetailsData } from '../details/details.selectors';

import { updateDraftProspectingMessaging, updateProspectingMessaging } from './messaging.actions';

const updateDraftProspectingMessagingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateDraftProspectingMessaging.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { id, ...body } }, state]) =>
      apiService.put(`/api/v1/campaigns/prospecting/drafts/${id}/messaging`, { body }, true).pipe(
        mergeMap(() => [
          updateDraftProspectingMessaging.fulfilled(body),
          GlobalMessage.messagesService.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" updated successfully!`,
          }),
          goToNextStep(),
        ]),
        catchError(handleError(handlers.handleAnyError(updateDraftProspectingMessaging.rejected))),
      ),
    ),
  );

const updateProspectingMessagingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingMessaging.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { id, ...body } }, state]) =>
      apiService.put(`/api/v1/campaigns/prospecting/${id}/messaging`, { body }, true).pipe(
        mergeMap(() => [
          updateProspectingMessaging.fulfilled(body),
          GlobalMessage.messagesService.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" updated successfully!`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateProspectingMessaging.rejected))),
      ),
    ),
  );

export default [updateDraftProspectingMessagingEpic, updateProspectingMessagingEpic];
