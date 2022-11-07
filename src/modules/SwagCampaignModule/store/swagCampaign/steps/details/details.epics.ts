import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { handleError, handlers, MessageType, showGlobalMessage } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { fetchSwagDraftById } from '../../swagCampaign.actions';

import { updateDraftSwagDetails, updateSwagDetails } from './details.actions';

const updateDraftSwagDetailsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateDraftSwagDetails.pending),
    switchMap(({ payload: { id, ...body } }) =>
      apiService
        .put(
          `/api/v1/campaigns/swag/drafts/${id}/details`,
          {
            body,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateDraftSwagDetails.fulfilled(body),
            goToNextStep(),
            fetchSwagDraftById.pending(id),
            showGlobalMessage({
              type: MessageType.Success,
              text: `"${body.campaignName}" updated successfully!`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateDraftSwagDetails.rejected))),
        ),
    ),
  );

const updateSwagDetailsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateSwagDetails.pending),
    switchMap(({ payload: { id, ...body } }) =>
      apiService
        .put(
          `/api/v1/campaigns/swag/${id}/details`,
          {
            body,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateSwagDetails.fulfilled(body),
            showGlobalMessage({
              type: MessageType.Success,
              text: `"${body.campaignName}" updated successfully!`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateSwagDetails.rejected))),
        ),
    ),
  );

export default [updateDraftSwagDetailsEpic, updateSwagDetailsEpic];
