import { omit } from 'ramda';

import { TSwagGifting } from '../../swagCampaign.types';

import {
  DefaultGiftDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from './gifting.types';

export const daysToSeconds = (days: number): number => days * 24 * 3600;
export const secondsToDays = (seconds: number): number => Math.ceil(seconds / 3600 / 24);

export const formValueToData = (value: TSwagCampaignGiftingForm): TSwagGifting => ({
  ...value,
  [GiftingStepFields.ExchangeMarketplaceSettings]: omit(
    [
      MarketplaceDataFields.IsDonationEnabled,
      MarketplaceDataFields.IsPhysicalEnabled,
      MarketplaceDataFields.IsGiftCardEnabled,
    ],
    value[GiftingStepFields.ExchangeMarketplaceSettings],
  ),
  [GiftingStepFields.DefaultGiftData]: {
    ...value[GiftingStepFields.DefaultGiftData],
    [DefaultGiftDataFields.DefaultGift]:
      value[GiftingStepFields.DefaultGiftData][DefaultGiftDataFields.DefaultGift] ?? null,
  },
});
