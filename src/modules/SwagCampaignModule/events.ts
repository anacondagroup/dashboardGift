import { TrackEvent } from '@alycecom/services';

import {
  TSwagDetails,
  TSwagDraftCampaign,
  TSwagGifting,
  TSwagMessaging,
  TSwagCodes,
} from './store/swagCampaign/swagCampaign.types';

export type TBaseEventPayload = {
  impersonateId: number | null;
};

export type TBaseEventOptions = {
  groupId: string | number | null;
  traits: {
    adminId: number | null;
    orgName: string;
    orgId: string | number | null;
  };
};

export type TTrackSwagCampaignEventPayload =
  | TSwagDetails
  | TSwagGifting
  | TSwagMessaging
  | TSwagCodes
  | TSwagDraftCampaign;

export const trackSwagCampaignEvent = <Payload = TTrackSwagCampaignEventPayload>(
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
