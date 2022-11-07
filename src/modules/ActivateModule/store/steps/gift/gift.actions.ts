import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ICustomMarketplaceSetting, IDefaultGift, IRecipientActions } from '../../activate.types';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';

import { ISaveMarketplaceParams, IUpdateGiftStepPayload } from './gift.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/GIFT';

export const updateMarketplaceSettingsRequest = createAction<ISaveMarketplaceParams>(
  `${PREFIX}/UPDATE_MARKETPLACE_REQUEST`,
);
export const updateMarketplaceSettingsSuccess = createAction<ISaveMarketplaceParams>(
  `${PREFIX}/UPDATE_MARKETPLACE_SUCCESS`,
);
export const updateMarketplaceSettingsFail = createAction<TErrors>(`${PREFIX}/UPDATE_MARKETPLACE_FAIL`);

export const updateDefaultGiftRequest = createAction<{
  products: IDefaultGift[];
}>(`${PREFIX}/UPDATE_DEFAULT_GIFT_REQUEST`);
export const updateDefaultGiftSuccess = createAction<{ products: IDefaultGift[] }>(
  `${PREFIX}/UPDATE_DEFAULT_GIFT_SUCCESS`,
);
export const updateDefaultGiftFail = createAction<TErrors>(`${PREFIX}/UPDATE_DEFAULT_GIFT_FAIL`);

export const updateGiftStepRequest = createAction<IUpdateGiftStepPayload>(`${PREFIX}/UPDATE_REQUEST`);
export const updateGiftStepSuccess = createAction<{ recipientActions: IRecipientActions }>(`${PREFIX}/UPDATE_SUCCESS`);
export const updateGiftStepFail = createAction<TErrors>(`${PREFIX}/UPDATE_FAIL`);

export const updateGiftExchangeOptionsRequest = createAction<{
  giftExchangeOptions: GiftExchangeOptions | null;
}>(`${PREFIX}/UPDATE_GIFT_EXCHANGE_OPTIONS_REQUEST`);
export const updateGiftExchangeOptionsSuccess = createAction<{ giftExchangeOptions: string | null }>(
  `${PREFIX}/UPDATE_GIFT_EXCHANGE_OPTIONS_SUCCESS`,
);
export const updateGiftExchangeOptionsFail = createAction<TErrors>(`${PREFIX}/UPDATE_GIFT_EXCHANGE_OPTIONS_FAIL`);

export const updateCustomMarketplaceSetting = createAction<ICustomMarketplaceSetting>(
  `${PREFIX}/UPDATE_GIFT_CUSTOM_MARKETPLACE_REQUEST`,
);
export const updateCustomMarketplaceSettingSuccess = createAction<ICustomMarketplaceSetting>(
  `${PREFIX}/UPDATE_GIFT_CUSTOM_MARKETPLACE_SUCCESS`,
);
export const updateCustomMarketplaceSettingFail = createAction(`${PREFIX}/UPDATE_GIFT_CUSTOM_MARKETPLACE_FAIL`);

export const updateAcceptOnlyDonationSetting = createAction<number>(`${PREFIX}/UPDATE_ACCEPT_ONLY_DONATION_REQUEST`);
export const updateAcceptOnlyDonationSettingSuccess = createAction<number>(
  `${PREFIX}/UPDATE_ACCEPT_ONLY_DONATION_SUCCESS`,
);
export const updateAcceptOnlyDonationSettingFail = createAction(`${PREFIX}/UPDATE_ACCEPT_ONLY_DONATION_FAIL`);

export const setGiftExchangeOption = createAction<{ exchangeOption: GiftExchangeOptions }>(
  `${PREFIX}/SET_GIFT_EXCHANGE_OPTION`,
);

export const updateAcceptOnlyFallbackGift = createAction<IDefaultGift>(
  `${PREFIX}/UPDATE_ACCEPT_ONLY_FALLBACK_GIFT_REQUEST`,
);
export const updateAcceptOnlyFallbackGiftSuccess = createAction<IDefaultGift>(
  `${PREFIX}/UPDATE_ACCEPT_ONLY_FALLBACK_GIFT_SUCCESS`,
);
export const updateAcceptOnlyFallbackGiftFail = createAction<IDefaultGift>(
  `${PREFIX}/UPDATE_ACCEPT_ONLY_FALLBACK_GIFT_FAIL`,
);
