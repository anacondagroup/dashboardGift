import { EntityId } from '@alycecom/utils';

/* eslint-disable camelcase */
export interface IGiftType {
  id: EntityId;
  name: string;
  description: string;
  isTeamRestricted: boolean;
  countryIds: number[];
}

export interface IOldGiftType {
  id: EntityId;
  name: string;
  is_campaign_restricted: boolean;
  is_team_restricted: boolean;
  countryIds: number[];
}

export interface IGiftTypeResponse {
  success: true;
  giftTypes: IGiftType[];
}

export interface IOldGiftTypesResponse {
  success: true;
  available_products_amount: number;
  types: IOldGiftType[];
}

export enum GiftTypes {
  physical = 1,
  subscription = 2,
  onDemand = 3,
  experience = 4,
  donation = 5,
  giftCard = 6,
  brandedProduct = 7,
}

export const isModernGiftTypesResponse = (
  response: IGiftTypeResponse | IOldGiftTypesResponse,
): response is IGiftTypeResponse => (response as IGiftTypeResponse).giftTypes !== undefined;

export const isModernGiftType = (giftType: IGiftType | IOldGiftType): giftType is IGiftType =>
  (giftType as IGiftType).description !== undefined;
