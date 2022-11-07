import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, map, withLatestFrom, filter } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, IResponse, MessageType, showGlobalMessage } from '@alycecom/services';
import { replace } from 'connected-react-router';

import { ProspectingBuilderStep, ProspectingCampaignRoutes } from '../../routePaths';

import { TProspectingCampaign, TProspectingDraftCampaign } from './prospectingCampaign.types';
import {
  createProspectingDraft,
  expireProspectingCampaignById,
  fetchProspectingById,
  fetchProspectingDraftById,
  unexpireProspectingCampaignById,
} from './prospectingCampaign.actions';
import stepsEpics from './steps/steps.epics';
import { updateDraftProspectingDetails } from './steps/details/details.actions';
import { getActiveStep } from './ui/activeStep/activeStep.selectors';
import { setActiveStep } from './ui/activeStep/activeStep.actions';

const createProspectingDraftEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createProspectingDraft.pending),
    switchMap(({ payload }) =>
      apiService
        .post(
          `/api/v1/campaigns/prospecting/drafts`,
          {
            body: payload,
          },
          true,
        )
        .pipe(
          mergeMap((response: IResponse<TProspectingDraftCampaign>) => [
            createProspectingDraft.fulfilled(response),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: `"${payload.campaignName}" created successfully!`,
            }),
            replace(ProspectingCampaignRoutes.buildBuilderUrl(response.data.id, ProspectingBuilderStep.Gift)),
          ]),
          catchError(handleError(handlers.handleAnyError(createProspectingDraft.rejected))),
        ),
    ),
  );

const fetchProspectingDraftCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProspectingDraftById.pending),
    switchMap(({ payload }) =>
      apiService.get(`/api/v1/campaigns/prospecting/drafts/${payload}`, null, true).pipe(
        map((response: IResponse<TProspectingDraftCampaign>) => fetchProspectingDraftById.fulfilled(response)),
        catchError(handleError(handlers.handleAnyError(fetchProspectingDraftById.rejected()))),
      ),
    ),
  );

const fetchProspectingCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProspectingById.pending),
    switchMap(({ payload }) =>
      apiService.get(`/api/v1/campaigns/prospecting/${payload}`, null, true).pipe(
        map((response: IResponse<TProspectingCampaign>) => fetchProspectingById.fulfilled(response)),
        catchError(handleError(handlers.handleAnyError(fetchProspectingById.rejected()))),
      ),
    ),
  );

const fetchProspectingDraftCampaignAfterUpdateDetailsEpic: Epic = action$ =>
  action$.pipe(
    ofType(updateDraftProspectingDetails.fulfilled),
    map(({ payload: { id } }) => fetchProspectingDraftById.pending(id)),
  );

const expireProspectingCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(expireProspectingCampaignById.pending),
    switchMap(({ payload: campaignId }) =>
      apiService
        .post(
          '/api/v1/campaigns/prospecting/expire',
          {
            body: { campaignId },
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            expireProspectingCampaignById.fulfilled(),
            showGlobalMessage({
              text: `Campaign successfully expired`,
              type: MessageType.Success,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(expireProspectingCampaignById.rejected()))),
        ),
    ),
  );

const unExpireProspectingCampaignByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(unexpireProspectingCampaignById.pending),
    switchMap(({ payload: campaignId }) =>
      apiService
        .post(
          '/api/v1/campaigns/prospecting/unexpire',
          {
            body: { campaignId },
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            unexpireProspectingCampaignById.fulfilled(),
            showGlobalMessage({
              text: `Campaign successfully unexpired`,
              type: MessageType.Success,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(unexpireProspectingCampaignById.rejected()))),
        ),
    ),
  );

export const setCurrentStepOnFetch: Epic = (action$, state$) =>
  action$.pipe(
    ofType(fetchProspectingDraftById.fulfilled),
    withLatestFrom(state$),
    filter(([, state]) => !getActiveStep(state)),
    map(([{ payload }]) => {
      let currentStep = ProspectingBuilderStep.Gift;
      if (payload.data.gifting) {
        currentStep = ProspectingBuilderStep.Messaging;
      }
      if (payload.data.messaging) {
        currentStep = ProspectingBuilderStep.Invites;
      }
      if (payload.data.giftLimitsInstalled) {
        currentStep = ProspectingBuilderStep.Finalize;
      }

      return setActiveStep(currentStep, { replace: true });
    }),
  );

export const prospectingCampaignEpics = [
  createProspectingDraftEpic,
  fetchProspectingDraftCampaignByIdEpic,
  fetchProspectingCampaignByIdEpic,
  fetchProspectingDraftCampaignAfterUpdateDetailsEpic,
  expireProspectingCampaignByIdEpic,
  unExpireProspectingCampaignByIdEpic,
  setCurrentStepOnFetch,
  ...stepsEpics,
];
