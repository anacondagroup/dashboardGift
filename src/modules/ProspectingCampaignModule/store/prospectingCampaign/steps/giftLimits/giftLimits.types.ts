import { IListResponse } from '@alycecom/services';
import { EntityId, TDictionary } from '@alycecom/utils';
import { SortDirectionType } from 'react-virtualized';

export enum GiftLimitsStepField {
  GiftLimits = 'giftLimits',
}

export enum GiftLimitMemberField {
  UserId = 'userId',
  Limit = 'limit',
  Period = 'period',
  Remaining = 'remaining',
}

export enum BulkUpdateFormFields {
  Limit = 'limit',
  Period = 'period',
}

export enum GiftLimitPeriod {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Infinite = 'infinite',
}

export type TGiftLimitsSortBy =
  | 'firstName'
  | GiftLimitMemberField.Limit
  | GiftLimitMemberField.Period
  | GiftLimitMemberField.Remaining;

export type TGiftLimitsFilters = {
  search: string;
  sort: {
    by?: TGiftLimitsSortBy;
    dir?: SortDirectionType;
  };
};

export type TProspectingCampaignMember = {
  userId: EntityId;
  limit: number | null;
  period: GiftLimitPeriod | null;
  remaining: number | null;
};

export type TUpdateProspectingCampaignMember = {
  userId: EntityId;
  limit: number;
  period: GiftLimitPeriod;
};

export type TBulkUpdateGiftLimitsForm = {
  limit: number;
  period: GiftLimitPeriod;
};

export type TBulkUpdateRemainingForm = {
  remaining: number | null;
};

export type TGiftLimitsResponse = IListResponse<TProspectingCampaignMember>;

export type TGiftLimitsForm = {
  giftLimits: TDictionary<TProspectingCampaignMember>;
};

export type TUpdateGiftLimitsRequest = {
  giftLimits: TUpdateProspectingCampaignMember[];
};

export type TUpdateRemainingGiftLimitsRequest = {
  userIds: EntityId[];
  remaining: number;
};
