import { omit } from 'ramda';

import { TProspectingGifting, TProspectingGiftMarketplaceData } from '../../prospectingCampaign.types';

import {
  DefaultGiftsDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TProspectingGiftingForm,
  TProspectingGiftMarketplaceDataWithTypes,
} from './gifting.types';

export const daysToSeconds = (days: number): number => days * 24 * 3600;
export const secondsToDays = (seconds: number): number => Math.ceil(seconds / 3600 / 24);

export const marketplaceValueToData = (
  data?: TProspectingGiftMarketplaceDataWithTypes | null,
): TProspectingGiftMarketplaceData | null =>
  data
    ? omit(
        [
          MarketplaceDataFields.IsDonationEnabled,
          MarketplaceDataFields.IsPhysicalEnabled,
          MarketplaceDataFields.IsGiftCardEnabled,
        ],
        data,
      )
    : null;

export const formValueToData = (value: TProspectingGiftingForm): TProspectingGifting => {
  const defaultGifts =
    value[GiftingStepFields.DefaultGiftsData][DefaultGiftsDataFields.DefaultGifts]?.filter(Boolean) ?? null;
  const recipientActions = value[GiftingStepFields.RecipientActionsData][RecipientActionsDataFields.RecipientActions];
  return {
    ...value,
    [GiftingStepFields.MarketplaceData]: marketplaceValueToData(value[GiftingStepFields.MarketplaceData]),
    [GiftingStepFields.DefaultGiftsData]: {
      ...value[GiftingStepFields.DefaultGiftsData],
      [DefaultGiftsDataFields.DefaultGifts]: defaultGifts?.length ? defaultGifts : null,
    },
    [GiftingStepFields.RecipientActionsData]: {
      ...value[GiftingStepFields.RecipientActionsData],
      [RecipientActionsDataFields.RecipientActions]: {
        ...recipientActions,
        [RecipientActionsFields.GifterAffidavit]: recipientActions.captureAffidavit
          ? recipientActions.gifterAffidavit
          : null,
        [RecipientActionsFields.GifterQuestion]: recipientActions.captureQuestion
          ? recipientActions.gifterQuestion
          : null,
      },
    },
  };
};
