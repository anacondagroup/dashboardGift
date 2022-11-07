import { IListResponseWithPagination, IOffsetPagination } from '@alycecom/services';

import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';
import { TABLE_SORT } from '../../../../../../components/Shared/CustomTable/customTable.constants';
import { IRowDataItem } from '../../../../../../components/Shared/CustomTable/CustomTable.types';

export enum CampaignBreakDownFilterTabs {
  All = 'all',
  Active = 'active',
  Draft = 'draft',
  Expired = 'expired',
  Archived = 'archived',
}

export const TAB_VALUE_TO_STATUS = {
  [CampaignBreakDownFilterTabs.Active]: CAMPAIGN_STATUS.ACTIVE,
  [CampaignBreakDownFilterTabs.Archived]: CAMPAIGN_STATUS.ARCHIVED,
  [CampaignBreakDownFilterTabs.Draft]: CAMPAIGN_STATUS.DRAFT,
  [CampaignBreakDownFilterTabs.Expired]: CAMPAIGN_STATUS.EXPIRED,
  [CampaignBreakDownFilterTabs.All]: null,
};

export type TCampaignEditor = {
  id: number;
  firstName: string;
  lastName: string;
};

export interface ICampaignBreakdownListItem extends IRowDataItem {
  id: number;
  name: string;
  type: CAMPAIGN_TYPES;
  unClaimedGifts: number;
  status: CAMPAIGN_STATUS;
  countryIds: number[];
  canEdit: boolean;
  team: {
    id: number;
    name: string;
  };
  giftsSent: number;
  giftsViewed: number;
  giftsAccepted: number;
  meetingsBooked: number;
  amountSpent: number;
  createdBy: TCampaignEditor | null;
  updatedBy: TCampaignEditor | null;
}

export interface ICampaignBreakdownResponseMeta {
  totalAll: number;
  totalDrafts: number;
  totalActive: number;
  totalExpired: number;
  totalArchived: number;
}

export interface ICampaignBreakdownResponse extends IListResponseWithPagination<ICampaignBreakdownListItem> {
  meta: ICampaignBreakdownResponseMeta;
}

export interface ISortCampaignBreakdownListPayload {
  field?: string;
  direction?: TABLE_SORT;
}

export interface IPaginationCampaignBreakdownListPayload {
  limit?: number;
  offset?: number;
}

export interface ICampaignBreakdownListRequestPayload {
  status?: CAMPAIGN_STATUS;
  search?: string;
  teamIds?: number[];
  countryIds?: number[];
  sort?: ISortCampaignBreakdownListPayload;
  pagination?: IPaginationCampaignBreakdownListPayload;
}

export interface ICampaignBreakdownListSuccessPayload {
  campaigns: ICampaignBreakdownListItem[];
  pagination: IOffsetPagination;
  meta: ICampaignBreakdownResponseMeta;
}
