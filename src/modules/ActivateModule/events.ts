import { TrackEvent } from '@alycecom/services';
import { TBaseEventPayload, TBaseEventOptions } from '@alycecom/modules';
import { upperFirstLetter } from '@alycecom/utils';

import { TUpdateDetailsFormValues } from './store/steps/details/detailsForm.schemas';
import { IActivateDraftGift } from './store';
import { IActivateMessaging } from './store/steps/messaging/messaging.types';
import { ActivateBuilderStep } from './routePaths';

export const trackCampaignBuilderNextButtonClicked = (
  step: ActivateBuilderStep,
  payload: TBaseEventPayload & {
    campaignId: number | null;
    formValues: Record<string, unknown> | undefined;
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: `1:Many Campaign Builder - ${upperFirstLetter(step)} - Next Button clicked`,
    payload,
    options,
  });

export const trackCampaignEditorSaveButtonClicked = (
  step: ActivateBuilderStep,
  payload: TBaseEventPayload & {
    campaignId: number;
    formValues: TUpdateDetailsFormValues | IActivateDraftGift | IActivateMessaging | undefined;
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: `1:Many Campaign Editor - ${upperFirstLetter(step)} - Save Button clicked`,
    payload,
    options,
  });

export const trackCampaignEditorCopyButtonClicked = (
  payload: TBaseEventPayload & {
    campaignId: number | null;
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: `1:Many Campaign Editor - Copy Link Button clicked`,
    payload,
    options,
  });
