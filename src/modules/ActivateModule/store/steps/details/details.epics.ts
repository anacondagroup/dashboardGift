import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';
import { replace } from 'connected-react-router';
import { CommonData, User } from '@alycecom/modules';

import { ActivateBuilderStep, ActivateCampaignRoutes, ActivateModes } from '../../../routePaths';
import { getActivateModuleParams } from '../../activate.selectors';
import { trackCampaignBuilderNextButtonClicked } from '../../../events';
import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { loadActivateRequest } from '../../activate.actions';

import {
  createActivateDraftFail,
  createActivateDraftRequest,
  createActivateDraftSuccess,
  updateDetailsFail,
  updateDetailsRequest,
  updateDetailsSuccess,
  updateFreeClaims,
} from './details.actions';
import { ICreateActivateResponse, TUpdateBuilderDetailsBody } from './details.types';
import { transformDetailsPayloadToBody } from './details.helpers';
import { getTeamId } from './details.selectors';

const createActivateDraftEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createActivateDraftRequest),
    withLatestFrom(state$),
    mergeMap(([{ payload }, state]) => {
      const body = transformDetailsPayloadToBody(payload);
      const [eventPayload, options] = User.selectors.getBaseEventPayload(state);
      return apiService.post(`/api/v1/campaigns/activate/drafts-v2`, { body }, true).pipe(
        mergeMap(({ data }: ICreateActivateResponse) => {
          const { countryIds } = data.details;
          const countryNames = CommonData.selectors
            .makeGetCountriesByIds(countryIds)(state)
            .map(({ name }) => name);

          return [
            createActivateDraftSuccess(payload),
            trackCampaignBuilderNextButtonClicked(
              ActivateBuilderStep.Details,
              {
                ...eventPayload,
                campaignId: data.id,
                formValues: {
                  ...data.details,
                  countryIds: countryIds.join(', '),
                  countryNames: countryNames.join(', '),
                },
              },
              options,
            ),
            replace(ActivateCampaignRoutes.buildBuilderUrl(data.id, ActivateBuilderStep.Gift)),
            showGlobalMessage({
              type: MessageType.Success,
              text: `Campaign ${data.details.campaignName} has been created`,
            }),
          ];
        }),
        catchError(
          apiService.handleError(
            handlers.handleAnyError(
              createActivateDraftFail,
              showGlobalMessage({ type: MessageType.Error, text: 'Ooops, error! Campaign not created, please retry' }),
            ),
          ),
        ),
      );
    }),
  );

const getUpdateDetailsEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/details`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/details`;
};

const updateDetailsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateDetailsRequest),
    withLatestFrom(state$),
    mergeMap(([{ payload }, state]) => {
      const { mode, campaignId } = getActivateModuleParams(state);
      const body = transformDetailsPayloadToBody(payload);

      const isBuilderMode = mode === ActivateModes.Builder;
      const isTeamChanged = isBuilderMode && (payload as TUpdateBuilderDetailsBody)?.teamId !== getTeamId(state);

      return apiService.put(getUpdateDetailsEndpoint(campaignId as number, mode as ActivateModes), { body }, true).pipe(
        mergeMap(() => [
          updateDetailsSuccess(payload),
          ...(isBuilderMode ? [goToNextStep()] : []),
          ...(isTeamChanged ? [loadActivateRequest({ campaignId, mode: mode as ActivateModes })] : []),
          showGlobalMessage({ type: MessageType.Success, text: `Campaign ${payload.campaignName} has been updated` }),
        ]),
        catchError(
          apiService.handleError(
            handlers.handleAnyError(
              updateDetailsFail,
              showGlobalMessage({ type: MessageType.Error, text: 'Ooops, error! Campaign not updated, please retry' }),
            ),
          ),
        ),
      );
    }),
  );

const updateFreeClaimsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateFreeClaims.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: body }, state]) =>
      apiService
        .put(
          `/api/v1/campaigns/activate/campaigns/${getActivateModuleParams(state).campaignId}/free-claims`,
          { body },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateFreeClaims.fulfilled(body),
            showGlobalMessage({ type: MessageType.Success, text: `Campaign has been updated` }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateFreeClaims.rejected))),
        ),
    ),
  );

export const detailsEpics = [createActivateDraftEpic, updateDetailsEpic, updateFreeClaimsEpic];
