import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { getDetailsData } from '../details/details.selectors';

import { updateDraftProspectingGifting, updateProspectingGifting } from './gifting.actions';

const updateDraftProspectingGiftingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateDraftProspectingGifting.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { id, ...body } }, state]) =>
      apiService.put(`/api/v1/campaigns/prospecting/drafts/${id}/gifting`, { body }, true).pipe(
        mergeMap(() => [
          updateDraftProspectingGifting.fulfilled(body),
          GlobalMessage.messagesService.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" updated successfully!`,
          }),
          goToNextStep(),
        ]),
        catchError(handleError(handlers.handleAnyError(updateDraftProspectingGifting.rejected))),
      ),
    ),
  );

const updateProspectingGiftingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingGifting.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { id, ...body } }, state]) =>
      apiService.put(`/api/v1/campaigns/prospecting/${id}/gifting`, { body }, true).pipe(
        mergeMap(() => [
          updateProspectingGifting.fulfilled(body),
          GlobalMessage.messagesService.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" updated successfully!`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateProspectingGifting.rejected))),
      ),
    ),
  );

export default [updateDraftProspectingGiftingEpic, updateProspectingGiftingEpic];
