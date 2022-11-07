import { EntityId } from '@alycecom/utils';

/* eslint-disable camelcase */
export interface IGiftVendor {
  id: EntityId;
  name: string;
  type: VendorTypes;
  description: string;
  isCampaignRestricted: boolean;
  isTeamRestricted: boolean;
  logoUrl: string;
}

export interface IOldGiftVendor {
  id: EntityId;
  name: string;
  type: VendorTypes;
  description: string;
  logo_url: string;
  countries: string[];
  is_team_restricted: boolean;
  is_campaign_restricted: boolean;
}

export interface IGiftVendorsResponse {
  success: true;
  giftVendors: IGiftVendor[];
}

export interface IOldGiftVendorsResponse {
  success: true;
  available_products_amount: number;
  vendors: IOldGiftVendor[];
}

export interface IVendorItem {
  id: EntityId;
  type: VendorTypes;
}

export enum VendorTypes {
  brand = 'brand',
  merchant = 'merchant',
}

export const isModernGiftVendorsResponse = (
  response: IGiftVendorsResponse | IOldGiftVendorsResponse,
): response is IGiftVendorsResponse => (response as IGiftVendorsResponse).giftVendors !== undefined;

export const isModernGiftVendor = (giftVendor: IGiftVendor | IOldGiftVendor): giftVendor is IGiftVendor =>
  (giftVendor as IGiftVendor).isTeamRestricted !== undefined;
