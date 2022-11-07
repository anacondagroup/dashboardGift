import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers } from '@alycecom/services';
import { combineLatest } from 'rxjs';
import { push } from 'connected-react-router';
import { CampaignSettings } from '@alycecom/modules';

import { ActivateModes } from '../routePaths';

import { stepsEpics } from './steps';
import { entitiesEpics } from './entities';
import {
  clearActivateModuleState,
  loadActivateFail,
  loadActivateRequest,
  loadActivateSuccess,
} from './activate.actions';
import { IActivateResponse, isActivate, isFullActivateDraft } from './activate.types';
import { IUploadRecipientsResponse } from './steps/recipients/uploadRequest/uploadRequest.types';
import { integrationRemindersEpics } from './integrationReminders';
import { brandingEpics } from './branding';
import { productsCountEpics } from './productsCount';
import { transformDetailsResponseToPayload } from './steps/details/details.helpers';
import { getLastUploadingRequestEndpoint } from './steps/recipients/uploadRequest/uploadRequest.helpers';
import { getActiveStep } from './ui/activeStep/activeStep.selectors';
import { setActiveStep } from './ui/activeStep/activeStep.actions';
import { calculateInitialStep } from './activate.helpers';
import { transformMessagingData } from './steps/messaging/messaging.helpers';

const getActivateCampaignEndpoint = (draftIdOrCampaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${draftIdOrCampaignId}`;
  }
  return `/api/v1/campaigns/activate/campaigns/${draftIdOrCampaignId}`;
};

const loadActivateDraft: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadActivateRequest),
    switchMap(({ payload: { campaignId, mode } }) => {
      const getCampaign = () =>
        apiService.get(getActivateCampaignEndpoint(campaignId as number, mode as ActivateModes), null, true);
      const getLastUploadingRequest = () =>
        apiService.get(getLastUploadingRequestEndpoint(campaignId as number, mode as ActivateModes), null, true);

      return combineLatest([getCampaign(), getLastUploadingRequest()]).pipe(
        map(responses => {
          const campaign = (responses[0] as IActivateResponse).data;
          const attributes = (responses[1] as IUploadRecipientsResponse).data?.attributes || null;

          if (isActivate(campaign)) {
            return loadActivateSuccess({
              ...campaign,
              details: transformDetailsResponseToPayload({
                ...campaign.details,
                claimedGiftsCount: campaign.claimedGiftsCount ?? 0,
                status: campaign.status,
              }),
              recipients: {
                ...campaign.recipients,
                attributes,
              },
              messaging: transformMessagingData(campaign.messaging),
            });
          }

          return loadActivateSuccess({
            ...campaign,
            details: transformDetailsResponseToPayload(campaign.details),
            recipients: {
              attributes,
            },
          });
        }),
        catchError(
          apiService.handleError(handlers.handleAnyError(loadActivateFail, () => push('/settings/campaigns'))),
        ),
      );
    }),
  );

export const setCurrentStepOnFetch: Epic = (action$, state$) =>
  action$.pipe(
    ofType(loadActivateSuccess),
    withLatestFrom(state$),
    filter(([{ payload }, state]) => !getActiveStep(state) && isFullActivateDraft(payload)),
    map(([{ payload }]) => {
      const currentStep = calculateInitialStep(payload);
      return setActiveStep(currentStep, { replace: true });
    }),
  );

const resetStateEpic: Epic = action$ =>
  action$.pipe(ofType(clearActivateModuleState), mapTo(CampaignSettings.actions.resetState()));

const globalDraftActivateEpics = [loadActivateDraft, setCurrentStepOnFetch, resetStateEpic];

export default [
  ...globalDraftActivateEpics,
  ...entitiesEpics,
  ...stepsEpics,
  ...integrationRemindersEpics,
  ...brandingEpics,
  ...productsCountEpics,
];
