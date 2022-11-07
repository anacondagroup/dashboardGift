import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState, loadActivateSuccess } from '../../activate.actions';
import { IActivateDraftGift } from '../../activate.types';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';

import {
  setGiftExchangeOption,
  updateAcceptOnlyFallbackGiftFail,
  updateAcceptOnlyFallbackGiftSuccess,
  updateAcceptOnlyDonationSettingSuccess,
  updateCustomMarketplaceSetting,
  updateCustomMarketplaceSettingFail,
  updateDefaultGiftFail,
  updateDefaultGiftRequest,
  updateDefaultGiftSuccess,
  updateGiftExchangeOptionsRequest,
  updateGiftStepFail,
  updateGiftStepRequest,
  updateGiftStepSuccess,
  updateMarketplaceSettingsFail,
  updateMarketplaceSettingsRequest,
  updateMarketplaceSettingsSuccess,
} from './gift.actions';

export interface IGiftState {
  status: StateStatus;
  data: IActivateDraftGift;
  errors: TErrors;
}

export const initialGiftState: IGiftState = {
  status: StateStatus.Idle,
  data: {
    defaultGift: null,
    fallbackGift: null,
    exchangeMarketplaceSettings: null,
    giftExchangeOptions: null,
    recipientActions: null,
    customMarketplace: null,
    donationSettings: null,
  },
  errors: {},
};

export const gift = createReducer({}, initialGiftState);

gift.on(loadActivateSuccess, (state, payload) => ({
  ...state,
  data: {
    defaultGift: payload.defaultGift,
    fallbackGift: payload.fallbackGift,
    exchangeMarketplaceSettings: payload.exchangeMarketplaceSettings,
    giftExchangeOptions: payload.giftExchangeOption,
    recipientActions: payload.recipientActions,
    customMarketplace: payload.customMarketplace,
    donationSettings: payload.donationSettings,
  },
}));

gift.on(clearActivateModuleState, () => ({
  ...initialGiftState,
}));

gift
  .on(updateMarketplaceSettingsRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(updateMarketplaceSettingsSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data: {
      ...state.data,
      exchangeMarketplaceSettings: payload,
    },
  }))
  .on(updateMarketplaceSettingsFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }));

gift.on(updateDefaultGiftRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
gift.on(updateDefaultGiftSuccess, (state, { products }) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    ...state.data,
    defaultGift: products,
  },
}));
gift.on(updateDefaultGiftFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

gift.on(updateGiftStepRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
gift.on(updateGiftStepSuccess, (state, { recipientActions }) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    ...state.data,
    recipientActions,
  },
}));
gift.on(updateGiftStepFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

gift.on(clearActivateModuleState, () => ({
  ...initialGiftState,
}));

gift.on(updateGiftExchangeOptionsRequest, (state, { giftExchangeOptions }) => ({
  ...state,
  data: {
    ...state.data,
    giftExchangeOptions,
  },
}));

gift.on(updateCustomMarketplaceSetting, (state, { id }) => ({
  ...state,
  data: {
    ...state.data,
    customMarketplace: id ? { id } : null,
  },
}));
gift.on(updateCustomMarketplaceSettingFail, state => ({
  ...state,
  data: {
    ...state.data,
    customMarketplace: null,
  },
}));

gift.on(setGiftExchangeOption, (state, { exchangeOption }) => ({
  ...state,
  data: {
    ...state.data,
    giftExchangeOptions: exchangeOption,
    exchangeMarketplaceSettings: null,
    customMarketplace: null,
  },
}));

gift.on(updateAcceptOnlyDonationSettingSuccess, (state, amount) => ({
  ...state,
  data: {
    ...state.data,
    donationSettings: {
      amount,
    },
  },
}));

gift.on(updateAcceptOnlyFallbackGiftSuccess, (state, fallbackGift) => ({
  ...state,
  data: {
    ...state.data,
    giftExchangeOptions: GiftExchangeOptions.acceptOnly,
    fallbackGift,
  },
}));

gift.on(updateAcceptOnlyFallbackGiftFail, state => ({
  ...state,
  data: {
    ...state.data,
    fallbackGift: null,
  },
}));
