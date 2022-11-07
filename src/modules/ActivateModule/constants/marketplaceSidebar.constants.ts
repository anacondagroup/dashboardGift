import { GiftTypes } from '../store/entities/giftTypes/giftTypes.types';

export enum FilterKeys {
  all = 'all',
  restricted = 'restricted',
  allowed = 'allowed',
}

export enum VendorsOptions {
  all = 'all',
  restricted = 'restricted',
}

export const PHYSICAL_GIFT_TYPE_LIST = [
  GiftTypes.physical,
  GiftTypes.subscription,
  GiftTypes.onDemand,
  GiftTypes.experience,
  GiftTypes.brandedProduct,
];
