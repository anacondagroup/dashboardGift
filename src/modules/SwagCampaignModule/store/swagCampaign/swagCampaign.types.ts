import { EntityId } from '@alycecom/utils';

export enum SwagNotificationStatus {
  GiftClaimed = 'giftClaimed',
}

export enum SwagNotificationStatusRecipient {
  Owner = 'notifyOwner',
}

export type TSwagNotificationStatusSetting = Record<SwagNotificationStatusRecipient, boolean>;

export type TSwagNotificationSettings = Record<SwagNotificationStatus, TSwagNotificationStatusSetting>;

export enum SwagDetailsFormFields {
  CampaignName = 'campaignName',
  Team = 'teamId',
  OwnerId = 'ownerId',
  CountryIds = 'countryIds',
  NotificationSettings = 'notificationSettings',
}

export enum SwagPhysicalCardColors {
  CardCmykColorC = 'cardCmykColorC',
  CardCmykColorM = 'cardCmykColorM',
  CardCmykColorY = 'cardCmykColorY',
  CardCmykColorK = 'cardCmykColorK',
}

export type TSwagDetailsFormValues = {
  [SwagDetailsFormFields.CampaignName]: string;
  [SwagDetailsFormFields.Team]: EntityId;
  [SwagDetailsFormFields.OwnerId]: EntityId;
  [SwagDetailsFormFields.CountryIds]: number[];
  [SwagDetailsFormFields.NotificationSettings]: TSwagNotificationSettings;
};

export type TSwagDetails = {
  campaignName: string;
  teamId: number;
  ownerId: EntityId;
  countryIds: number[];
  notificationSettings: TSwagNotificationSettings;
};

export type TSwagGiftMarketplaceData = {
  minBudgetAmount: number | null;
  maxBudgetAmount: number | null;
  giftCardMaxBudget: number | null;
  donationMaxBudget: number | null;
  restrictedGiftTypeIds: EntityId[];
  restrictedBrandIds: EntityId[];
  restrictedMerchantIds: EntityId[];
};

export type TSwagCustomMarketplaceData = {
  id: number | null;
};

export type TSwagDefaultGift = {
  productId: number;
  denomination: number | null;
};

export type TSwagDefaultGiftData = {
  defaultGift: TSwagDefaultGift | null;
};

export type TSwagGiftActionsData = {
  accept: boolean;
  exchange: boolean;
  donate: boolean;
};

export type TSwagRecipientActions = {
  capturePhone: boolean;
  captureEmail: boolean;
  captureDate: boolean;
  captureAffidavit: boolean;
  gifterAffidavit: string | null;
  captureQuestion: boolean;
  gifterQuestion: string | null;
};

export type TSwagRecipientActionsData = {
  recipientActions: TSwagRecipientActions | null;
};

export type TSwagGifting = {
  option: string;
  exchangeMarketplaceSettings: TSwagGiftMarketplaceData;
  customMarketplaceData: TSwagCustomMarketplaceData;
  defaultGiftData: TSwagDefaultGiftData;
  giftActionsData: TSwagGiftActionsData;
  recipientActionsData: TSwagRecipientActionsData;
};

export type TSwagMessageData = {
  pageHeader: string;
  pageBody: string;
};

export type TSwagMessaging = {
  messageData: TSwagMessageData;
};

export type TSwagDraftCampaign = {
  id: number;
  details: TSwagDetails;
  gifting: TSwagGifting | null;
  messaging: TSwagMessaging | null;
  codes: TSwagCodes | null;
};

export type TDeliveryAddress = {
  addressLine1: string;
  addressLine2: string;
  state: string;
  zip: string;
  city: string;
  countryId: number;
};

export type TSwagCardOrder = {
  codesBatchName: string;
  codesBatchOwnerId?: number;
  codesAmount: number;
  codesExpirationDate: string;
  contactName?: string;
  codeFormat: string;
  deliveryAddress?: TDeliveryAddress;
};

export type TCardCmykColor = {
  c: number;
  m: number;
  y: number;
  k: number;
};

export type TSwagCardDesign = {
  cardLogo?: Blob;
  cardType: string;
  cardHexColor: string;
  cardCmykColor: TCardCmykColor;
  cardCopyFirstLine: string;
  cardCopySecondLine: string;
  cardCopyThirdLine: string;
  fileName?: string;
  file?: string;
};

export type TSwagCardDesignResponse = {
  cardLogo: Blob;
  cardType: string;
  cardHexColor: string;
  cardCmykColorC: string;
  cardCmykColorM: string;
  cardCmykColorY: string;
  cardCmykColorK: string;
  cardCopyFirstLine: string;
  cardCopySecondLine: string;
  cardCopyThirdLine: string;
  fileName: string;
  file?: string;
};

export type TSwagCodes = {
  cardOrder: TSwagCardOrder;
  cardDesign?: TSwagCardDesign | null;
};

export type TSwagCampaign = {
  id: number;
  details: TSwagDetails;
  gifting: TSwagGifting;
  messaging: TSwagMessaging;
  codes: TSwagCodes;
};

export type TSwagDraftCampaignResponse = {
  id: number;
  details: TSwagDetails;
  exchangeMarketplaceSettings: TSwagGiftMarketplaceData | null;
  giftActions: TSwagGiftActionsData | null;
  giftExchangeOption: string;
  defaultGift: TSwagDefaultGift | null;
  customMarketplace: { id: number } | null;
  messaging: TSwagMessageData | null;
  recipientActions: TSwagRecipientActions | null;
  cardOrder: TSwagCardOrder | null;
  cardDesign: TSwagCardDesignResponse | null;
};
