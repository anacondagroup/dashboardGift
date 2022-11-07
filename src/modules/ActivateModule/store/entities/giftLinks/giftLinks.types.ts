import { EntityId } from '@alycecom/utils';
import { IListResponse } from '@alycecom/services';

export enum IntegrationType {
  Microsoft = 'GRAPH',
  Google = 'GOOGLE',
}

export type TGiftLink = {
  userId: EntityId;
  firstName: string;
  lastName: string;
  integrationType: IntegrationType | null;
  giftLink: string;
  email: string;
  imageUrl: string;
};

export type TGiftLinkSortFilter = {
  field: 'firstName' | 'hasIntegration';
  direction?: 'desc' | 'asc';
};

export type TGiftLinkPaginationFilter = {
  offset?: number;
  limit?: number;
};

export type TGiftLinkFilter = {
  search?: string;
  pagination?: TGiftLinkPaginationFilter;
  sort?: TGiftLinkSortFilter;
};

export type TGiftLinksResponse = IListResponse<TGiftLink> & { pagination: { total: number } };
