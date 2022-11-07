import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, switchMap, map, mergeMap } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, IResponse, MessageType } from '@alycecom/services';
import { replace } from 'connected-react-router';

import { SwagCampaignBuilderStep, SwagCampaignRoutes } from '../../routePaths';

import { TSwagCampaign, TSwagDraftCampaignResponse } from './swagCampaign.types';
import { createSwagDraft, fetchSwagById, fetchSwagDraftById } from './swagCampaign.actions';
import uiEpics from './ui/ui.epics';
import stepsEpics from './steps/steps.epics';
import { transformSwagCampaignResponse } from './swagCampaign.helpers';

const createSwagDraftEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createSwagDraft.pending),
    switchMap(({ payload }) =>
      apiService
        .post(
          `/api/v1/campaigns/swag/drafts`,
          {
            body: payload,
          },
          true,
        )
        .pipe(
          mergeMap((response: IResponse<TSwagDraftCampaignResponse>) => [
            createSwagDraft.fulfilled({ data: transformSwagCampaignResponse(response.data) }),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: `"${payload.campaignName}" created successfully!`,
            }),
            replace(SwagCampaignRoutes.buildBuilderUrl(response.data.id, SwagCampaignBuilderStep.Gift)),
          ]),
          catchError(handleError(handlers.handleAnyError(createSwagDraft.rejected))),
        ),
    ),
  );

const fetchSwagDraftCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchSwagDraftById.pending),
    switchMap(({ payload }) =>
      apiService.get(`/api/v1/campaigns/swag/drafts/${payload}`, null, true).pipe(
        map((response: IResponse<TSwagDraftCampaignResponse>) =>
          fetchSwagDraftById.fulfilled({ data: transformSwagCampaignResponse(response.data) }),
        ),
        catchError(handleError(handlers.handleAnyError(fetchSwagDraftById.rejected()))),
      ),
    ),
  );

const fetchSwagCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchSwagById.pending),
    switchMap(({ payload }) =>
      apiService.get(`/api/v1/campaigns/swag/${payload}`, null, true).pipe(
        map((response: IResponse<TSwagCampaign>) => fetchSwagById.fulfilled(response)),
        catchError(handleError(handlers.handleAnyError(fetchSwagById.rejected()))),
      ),
    ),
  );

export const swagCampaignEpics = [
  createSwagDraftEpic,
  fetchSwagDraftCampaignByIdEpic,
  fetchSwagCampaignByIdEpic,
  ...stepsEpics,
  ...uiEpics,
];
