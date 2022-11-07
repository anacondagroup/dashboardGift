import { EntityId } from '@alycecom/utils';

import {
  ICustomMarketplaceSetting,
  IExchangeMarketplaceSettings,
  IRecipientActions,
  IDefaultGift,
  IDonationSettings,
} from '../../activate.types';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';

export interface ISaveMarketplaceParams {
  minBudgetAmount: number | null;
  maxBudgetAmount: number | null;
  giftCardMaxBudget: number | null;
  donationMaxBudget: number | null;
  restrictedGiftTypeIds: EntityId[];
  restrictedBrandIds: EntityId[];
  restrictedMerchantIds: EntityId[];
}

export interface IRestrictedVendors {
  restrictedBrandIds: EntityId[];
  restrictedMerchantIds: EntityId[];
}

export interface IUpdateGiftStepPayload {
  recipientActions: IRecipientActions;
}

export interface IUpdateGiftExchangeOptionsPayload {
  exchangeMarketplaceSettings?: IExchangeMarketplaceSettings | null;
  customMarketplace?: ICustomMarketplaceSetting | null;
}

export interface IUpdateGiftExchangeOptions {
  giftExchangeOption: GiftExchangeOptions;
  exchangeMarketplaceSettings: IExchangeMarketplaceSettings | null;
  customMarketplace: ICustomMarketplaceSetting | null;
  donationSettings: IDonationSettings | null;
  fallbackGift: IDefaultGift | null;
}
