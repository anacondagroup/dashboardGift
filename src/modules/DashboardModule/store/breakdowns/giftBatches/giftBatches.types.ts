import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';

export type TGiftBatches = {
  id: number;
  giftsCount: number;
  defaultProduct?: TProduct;
  campaign?: TCampaign;
  sendAs?: TSendInfo;
  sentAt: string;
};

export type TProduct = {
  id: number;
  name: string;
};

export type TCampaign = {
  id: number;
  name: string;
};

export type TSendInfo = {
  id: number;
  fullName: string;
};

export type TGiftBatchesPayload = {
  data: TGiftBatches[];
  pagination: TPaginationPayload;
};

export type TPagination = {
  total: number;
  currentPage: number;
  perPage: number;
  offset: number;
};

export type TPaginationPayload = {
  total: number;
  offset: number;
  limit: number;
};

export type TGiftBatchesFilter = {
  teamIds: number[] | string[];
  campaignIds: number[];
};

export type TSort = {
  column?: string;
  direction?: TABLE_SORT;
};

export enum GiftBatchesTableFields {
  GiftsCount = 'giftsCount',
  DefaultProduct = 'defaultProduct',
  Campaign = 'campaign',
  SendAs = 'sendAs',
  SentAt = 'sentAt',
  Status = 'status',
}
