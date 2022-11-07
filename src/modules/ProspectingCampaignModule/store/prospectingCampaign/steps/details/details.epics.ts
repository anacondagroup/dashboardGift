import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';

import { updateDraftProspectingDetails, updateProspectingDetails } from './details.actions';

const updateDraftProspectingDetailsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateDraftProspectingDetails.pending),
    switchMap(({ payload: { id, ...body } }) =>
      apiService
        .put(
          `/api/v1/campaigns/prospecting/drafts/${id}/details`,
          {
            body,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateDraftProspectingDetails.fulfilled({ id, ...body }),
            goToNextStep(),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: `"${body.campaignName}" updated successfully!`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateDraftProspectingDetails.rejected))),
        ),
    ),
  );

const updateProspectingDetailsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingDetails.pending),
    switchMap(({ payload: { id, ...body } }) =>
      apiService
        .put(
          `/api/v1/campaigns/prospecting/${id}/details`,
          {
            body,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateProspectingDetails.fulfilled(body),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: `"${body.campaignName}" updated successfully!`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateProspectingDetails.rejected))),
        ),
    ),
  );

export default [updateDraftProspectingDetailsEpic, updateProspectingDetailsEpic];
