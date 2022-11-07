import { Path } from 'react-hook-form';
import { EntityId } from '@reduxjs/toolkit';

import {
  TProspectingDefaultGift,
  TProspectingDefaultGiftData,
  TProspectingGifting,
  TProspectingGiftMarketplaceData,
} from '../../prospectingCampaign.types';

export enum GiftingStepFields {
  MarketplaceData = 'marketplaceData',
  DefaultGiftsData = 'defaultGiftsData',
  GiftActionsData = 'giftActionsData',
  RecipientActionsData = 'recipientActionsData',
  CustomMarketplaceData = 'customMarketplaceData',
}

export enum MarketplaceDataFields {
  MinPrice = 'minPrice',
  MaxPrice = 'maxPrice',
  GiftCardPrice = 'giftCardPrice',
  DonationPrice = 'donationPrice',
  RestrictedTypeIds = 'restrictedProductTypeIds',
  RestrictedBrandIds = 'restrictedBrandIds',
  RestrictedMerchantIds = 'restrictedMerchantIds',

  IsPhysicalEnabled = '__isPhysicalEnabled',
  IsGiftCardEnabled = '__isGiftCardEnabled',
  IsDonationEnabled = '__isDonationEnabled',
}

export enum CustomMarketplaceDataFields {
  MarketplaceId = 'id',
}

export enum DefaultGiftsDataFields {
  DefaultGifts = 'defaultGifts',
  Override = 'overrideEnabled',
}

export enum GiftActionsDataFields {
  Accept = 'accept',
  Exchange = 'exchange',
  Donate = 'donate',
  ExpireInSeconds = 'expireInSeconds',
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
  Override = 'overrideEnabled',
}

export type TProspectingGiftMarketplaceDataWithTypes = TProspectingGiftMarketplaceData & {
  [MarketplaceDataFields.IsDonationEnabled]: boolean;
  [MarketplaceDataFields.IsPhysicalEnabled]: boolean;
  [MarketplaceDataFields.IsGiftCardEnabled]: boolean;
};

export type TProspectingGiftingForm = TProspectingGifting & {
  [GiftingStepFields.MarketplaceData]: TProspectingGiftMarketplaceDataWithTypes | null;
  [GiftingStepFields.DefaultGiftsData]: TProspectingDefaultGiftData & {
    [DefaultGiftsDataFields.DefaultGifts]: TProspectingDefaultGift[] | null;
  };
  [GiftingStepFields.CustomMarketplaceData]: {
    [CustomMarketplaceDataFields.MarketplaceId]: EntityId | null;
  } | null;
};

export type TGiftingErrors = Partial<Record<Path<TProspectingGifting>, string[]>>;
