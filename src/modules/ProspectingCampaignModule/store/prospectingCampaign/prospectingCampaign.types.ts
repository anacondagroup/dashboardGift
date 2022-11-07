import { EntityId } from '@alycecom/utils';

export enum NotificationStatus {
  GiftViewed = 'giftViewed',
  GiftExpired = 'giftExpired',
  GiftClaimedOrDeclined = 'giftClaimedOrDeclined',
}

export enum NotificationStatusRecipient {
  Owner = 'notifyOwner',
  SendAs = 'notifySendAsPerson',
  Sender = 'notifySender',
}

export type TNotificationStatusSetting = Record<NotificationStatusRecipient, boolean>;

export type TNotificationSettings = Record<NotificationStatus, TNotificationStatusSetting>;

export type TProspectingDetails = {
  campaignName: string;
  teamId: number;
  ownerId: EntityId;
  countryIds: number[];
  campaignInstruction: string | null;
  notificationSettings: TNotificationSettings;
  teamMemberIds: number[];
};

export type TProspectingGiftMarketplaceData = {
  minPrice: number | null;
  maxPrice: number | null;
  giftCardPrice: number | null;
  donationPrice: number | null;
  restrictedProductTypeIds: EntityId[];
  restrictedBrandIds: EntityId[];
  restrictedMerchantIds: EntityId[];
};

export type TProspectingDefaultGift = {
  id: number;
  denomination: number | null;
};

export type TProspectingDefaultGiftData = {
  defaultGifts: TProspectingDefaultGift[] | null;
  overrideEnabled: boolean;
};

export type TProspectingGiftActionsData = {
  accept: boolean;
  exchange: boolean;
  donate: boolean;
  expireInSeconds: number | null;
};

export type TProspectingRecipientActions = {
  capturePhone: boolean;
  captureEmail: boolean;
  captureDate: boolean;
  captureAffidavit: boolean;
  gifterAffidavit: string | null;
  captureQuestion: boolean;
  gifterQuestion: string | null;
};

export type TProspectingRecipientActionsData = {
  recipientActions: TProspectingRecipientActions;
  overrideEnabled: boolean;
};

export type TProspectingCustomMarketplaceData = {
  id: EntityId;
};

export type TProspectingGifting = {
  marketplaceData: TProspectingGiftMarketplaceData | null;
  defaultGiftsData: TProspectingDefaultGiftData;
  giftActionsData: TProspectingGiftActionsData;
  recipientActionsData: TProspectingRecipientActionsData;
  customMarketplaceData: TProspectingCustomMarketplaceData | null;
};

export type TProspectingMessageData = {
  overrideEnabled: boolean;
  header: string;
  message: string;
};

export enum RedemptionAfterClaimAction {
  NoCta = 'no-cta',
  Redirect = 'redirect',
}

export type TProspectingMessageRedemptionData = {
  afterClaimAction: null | RedemptionAfterClaimAction;
  afterClaimRedirectUrl: null | string;
  redemptionPopupEnabled: boolean;
  redemptionPopup: null | {
    header: string;
    message: string;
    buttonLabel: string;
  };
};

export enum MessageVideoType {
  Embed = 'embed',
  Vidyard = 'vidyard',
}

export type TProspectingMessageVideoData = {
  overrideEnabled: boolean;
  type: null | MessageVideoType;
  embed: null | {
    videoUrl: string;
  };
  vidyard: null | {
    imageUrl: string;
    videoUrl: string;
  };
};

export type TProspectingMessaging = {
  messageData: TProspectingMessageData;
  redemptionData: TProspectingMessageRedemptionData;
  videoData: TProspectingMessageVideoData;
};

export type TProspectingDraftCampaign = {
  id: number;
  details: TProspectingDetails;
  gifting: TProspectingGifting | null;
  messaging: TProspectingMessaging | null;
  giftLimitsInstalled: boolean;
};

export type TProspectingCampaign = {
  id: number;
  details: TProspectingDetails;
  gifting: TProspectingGifting;
  messaging: TProspectingMessaging;
};
