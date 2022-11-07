import { TrackEvent } from '@alycecom/services';
import { TBaseEventPayload, TBaseEventOptions } from '@alycecom/modules';

import {
  TProspectingDetails,
  TProspectingGifting,
  TProspectingMessaging,
} from './store/prospectingCampaign/prospectingCampaign.types';
import {
  TUpdateGiftLimitsRequest,
  TUpdateRemainingGiftLimitsRequest,
} from './store/prospectingCampaign/steps/giftLimits/giftLimits.types';

export type TTrackProspectingCampaignEventPayload =
  | TProspectingDetails
  | TProspectingMessaging
  | TProspectingGifting
  | TUpdateGiftLimitsRequest
  | TUpdateRemainingGiftLimitsRequest;

export const trackProspectingCampaignEvent = <Payload = TTrackProspectingCampaignEventPayload>(
  name: string,
  payload: Payload &
    TBaseEventPayload & {
      id: number | null;
    },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name,
    payload,
    options,
  });
