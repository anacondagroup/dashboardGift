import { CAMPAIGN_PURPOSE_OPTIONS, CUSTOM_CAMPAIGN_PURPOSE } from '@alycecom/modules';

import { TNotificationSettings, ClaimType, TClaimType } from '../../activate.types';

export const transformDetailsPayloadToBody = <
  T extends {
    campaignPurpose: string;
    ownPurpose: string | null;
    freeClaims: number | null;
    notificationSettings: TNotificationSettings;
    claimType?: TClaimType;
  }
>(
  body: T,
): Omit<T, 'ownPurpose'> => {
  const { ownPurpose, campaignPurpose, freeClaims, notificationSettings, claimType, ...details } = body;

  return {
    ...details,
    claimType,
    notificationSettings: {
      ...notificationSettings,
      reachedClaimLimits: {
        ...notificationSettings.reachedClaimLimits,
        notifyOwner: claimType === ClaimType.PreApproved ? false : notificationSettings.reachedClaimLimits.notifyOwner,
      },
    },
    campaignPurpose: campaignPurpose === CUSTOM_CAMPAIGN_PURPOSE ? ownPurpose || '' : campaignPurpose,
    freeClaims: freeClaims === null ? 0 : freeClaims,
  } as Omit<T, 'ownPurpose'>;
};

export const transformDetailsResponseToPayload = <T extends { campaignPurpose: string }>(
  response: T,
): T & { ownPurpose: null | string } => {
  const { campaignPurpose } = response;
  const isPresetPurpose =
    campaignPurpose !== CUSTOM_CAMPAIGN_PURPOSE &&
    CAMPAIGN_PURPOSE_OPTIONS.includes(campaignPurpose as typeof CAMPAIGN_PURPOSE_OPTIONS[number]);

  return {
    ...response,
    campaignPurpose: isPresetPurpose ? campaignPurpose : CUSTOM_CAMPAIGN_PURPOSE,
    ownPurpose: isPresetPurpose ? null : campaignPurpose,
  };
};
