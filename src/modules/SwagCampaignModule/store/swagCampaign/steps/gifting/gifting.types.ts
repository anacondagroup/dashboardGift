import { Path } from 'react-hook-form';

import {
  TSwagCustomMarketplaceData,
  TSwagDefaultGiftData,
  TSwagGifting,
  TSwagGiftMarketplaceData,
  TSwagRecipientActionsData,
} from '../../swagCampaign.types';

export enum GiftingStepFields {
  OptionMarketplace = 'option',
  ExchangeMarketplaceSettings = 'exchangeMarketplaceSettings',
  CustomMarketPlaceData = 'customMarketplaceData',
  DefaultGiftData = 'defaultGiftData',
  GiftActionsData = 'giftActionsData',
  RecipientActionsData = 'recipientActionsData',
}

export enum MarketplaceDataFields {
  MinBudgetAmount = 'minBudgetAmount',
  MaxBudgetAmount = 'maxBudgetAmount',
  GiftCardMaxBudget = 'giftCardMaxBudget',
  DonationMaxBudget = 'donationMaxBudget',
  RestrictedGiftTypeIds = 'restrictedGiftTypeIds',
  RestrictedBrandIds = 'restrictedBrandIds',
  RestrictedMerchantIds = 'restrictedMerchantIds',

  IsPhysicalEnabled = '__isPhysicalEnabled',
  IsGiftCardEnabled = '__isGiftCardEnabled',
  IsDonationEnabled = '__isDonationEnabled',
}

export enum CustomMarketplaceDataFields {
  Id = 'id',
}

export enum DefaultGiftDataFields {
  DefaultGift = 'defaultGift',
  ProductId = 'productId',
  Denomination = 'denomination',
}

export enum GiftActionsDataFields {
  Accept = 'accept',
  Exchange = 'exchange',
  Donate = 'donate',
}

export enum RecipientActionsFields {
  CapturePhone = 'capturePhone',
  CaptureEmail = 'captureEmail',
  CaptureDate = 'captureDate',
  CaptureAffidavit = 'captureAffidavit',
  CaptureQuestion = 'captureQuestion',
  GifterQuestion = 'gifterQuestion',
  GifterAffidavit = 'gifterAffidavit',
}

export enum RecipientActionsDataFields {
  RecipientActions = 'recipientActions',
}

export type TSwagCampaignGiftingForm = TSwagGifting & {
  [GiftingStepFields.OptionMarketplace]: string;
  [GiftingStepFields.ExchangeMarketplaceSettings]: TSwagGiftMarketplaceData & {
    [MarketplaceDataFields.IsDonationEnabled]: boolean;
    [MarketplaceDataFields.IsPhysicalEnabled]: boolean;
    [MarketplaceDataFields.IsGiftCardEnabled]: boolean;
  };
  [GiftingStepFields.DefaultGiftData]: TSwagDefaultGiftData;
  [GiftingStepFields.RecipientActionsData]: TSwagRecipientActionsData;
  [GiftingStepFields.CustomMarketPlaceData]: TSwagCustomMarketplaceData;
};

export type TGiftingErrors = Partial<Record<Path<TSwagGifting>, string[]>>;
