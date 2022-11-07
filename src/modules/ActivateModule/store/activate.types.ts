import { EntityId } from '@alycecom/utils';
import { TCampaignStatus } from '@alycecom/services';

import { GiftExchangeOptions } from '../constants/exchange.constants';
import { DetailsConstants } from '../constants/details.constants';

import {
  IUploadRequestAttributes,
  UploadRequestSourceTypes,
} from './steps/recipients/uploadRequest/uploadRequest.types';
import { IActivateMessaging } from './steps/messaging/messaging.types';
import { IRecipients } from './steps/recipients/recipients.types';

export enum RecipientActions {
  capturePhone = 'capturePhone',
  captureEmail = 'captureEmail',
  captureDate = 'captureDate',
  captureQuestion = 'captureQuestion',
  question = 'gifterQuestion',
  captureAffidavit = 'captureAffidavit',
  affidavit = 'gifterAffidavit',
}

export enum NotificationStatusRecipient {
  Owner = 'notifyOwner',
  SendAs = 'notifySendAsPerson',
}

export enum NotificationStatus {
  GiftViewed = 'giftViewed',
  GiftExpired = 'giftExpired',
  GiftClaimedOrDeclined = 'giftClaimedOrDeclined',
  ReachedClaimLimits = 'reachedClaimLimits',
}

export type TNotificationStatusSetting = {
  [NotificationStatusRecipient.Owner]: boolean;
  [NotificationStatusRecipient.SendAs]: boolean;
};

export type TNotificationSettings = {
  [NotificationStatus.GiftViewed]: TNotificationStatusSetting;
  [NotificationStatus.GiftExpired]: TNotificationStatusSetting;
  [NotificationStatus.GiftClaimedOrDeclined]: TNotificationStatusSetting;
  [NotificationStatus.ReachedClaimLimits]: TNotificationStatusSetting;
};

export interface IActivateResponse {
  data: IActivateDraft | IActivate;
}

export interface IActivateCampaignResponse {
  data: IFullActivate;
}

export enum ClaimType {
  PreApproved = 'pre-approved',
  FreeClaim = 'free-claim',
}

export type TClaimType = ClaimType;

export interface IActivateDetails {
  campaignName: string;
  teamId: EntityId;
  ownerId: EntityId;
  countryIds: number[];
  expirationDate: string | null;
  sendAsOption: DetailsConstants | null;
  sendAsId: EntityId | null;
  notificationSettings: TNotificationSettings;
  campaignPurpose: string;
  ownPurpose: string;
  numberOfRecipients: string;
  claimType: TClaimType;
  freeClaims: number | null;
  claimedGiftsCount?: number;
  status?: TCampaignStatus;
}

export interface IExchangeMarketplaceSettings {
  minBudgetAmount: number | null;
  maxBudgetAmount: number | null;
  giftCardMaxBudget: number | null;
  donationMaxBudget: number | null;
  restrictedGiftTypeIds: EntityId[];
  restrictedBrandIds: EntityId[];
  restrictedMerchantIds: EntityId[];
}

export interface IRecipientActions {
  [RecipientActions.capturePhone]: boolean;
  [RecipientActions.captureEmail]: boolean;
  [RecipientActions.captureDate]: boolean;
  [RecipientActions.captureQuestion]: boolean;
  [RecipientActions.captureAffidavit]: boolean;
  [RecipientActions.question]: string | null;
  [RecipientActions.affidavit]: string | null;
}

export interface ICustomMarketplaceSetting {
  id: EntityId | null;
}

export interface IDonationSettings {
  amount: number;
}

export interface IDefaultGift {
  productId: number;
  denomination?: number;
}

export interface IActivateDraftGift {
  defaultGift: IDefaultGift[] | null;
  fallbackGift: IDefaultGift | null;
  exchangeMarketplaceSettings: IExchangeMarketplaceSettings | null;
  giftExchangeOptions: GiftExchangeOptions | null;
  recipientActions: IRecipientActions | null;
  customMarketplace: ICustomMarketplaceSetting | null;
  donationSettings: IDonationSettings | null;
}

export interface IActivateDraft {
  id: number;
  details: IActivateDetails;
  giftExchangeOption: GiftExchangeOptions | null;
  exchangeMarketplaceSettings: IExchangeMarketplaceSettings | null;
  defaultGift: IDefaultGift[] | null;
  fallbackGift: IDefaultGift | null;
  recipientActions: IRecipientActions | null;
  customMarketplace: ICustomMarketplaceSetting | null;
  donationSettings: IDonationSettings | null;
  notificationSettings: {
    notifySender: boolean;
    notifyCampaignManager: boolean;
    notifyTeamMember: boolean[];
  };
  messaging: IActivateMessaging;
  isGiftingOnTheFly: boolean;
  claimedGiftsCount: number;
  status: TCampaignStatus;
}

export interface IFullActivateDraft extends IActivateDraft {
  recipients: {
    attributes: IUploadRequestAttributes | null;
  };
}

export interface IActivate extends IActivateDraft {
  campaignLink: string;
  recipients: {
    sourceType: UploadRequestSourceTypes | null;
    marketoComputedUrl: string | null;
  };
}

export interface IFullActivate extends IActivate {
  recipients: IRecipients;
  details: IActivate['details'] & { claimedGiftsCount: number; status: TCampaignStatus };
}

export const isDraftActivate = (campaign: IActivateDraft | IActivate): campaign is IActivateDraft =>
  (campaign as IActivate).campaignLink === undefined;

export const isActivate = (campaign: IActivateDraft | IActivate): campaign is IActivate =>
  (campaign as IActivate).campaignLink !== undefined;

export const isFullActivate = (campaign: IFullActivate | IFullActivateDraft): campaign is IFullActivate =>
  (campaign as IFullActivate).campaignLink !== undefined;

export const isFullActivateDraft = (campaign: IFullActivate | IFullActivateDraft): campaign is IFullActivateDraft =>
  (campaign as IFullActivate).campaignLink === undefined;
