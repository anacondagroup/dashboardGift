import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';

import * as types from './campaignSettings.types';
import * as actions from './campaignSettings.actions';

export interface ICampaignSettingsState extends types.TMarketplaceCampaignSettings {
  isLoaded: boolean;
  isLoading: boolean;
  errors: TErrors;
  campaignId: number;
}

export const initialState: ICampaignSettingsState = {
  isLoaded: false,
  isLoading: false,
  campaignId: 0,
  isInternational: false,
  countryIds: [],
  minPrice: undefined,
  maxPrice: undefined,
  giftCardPrice: undefined,
  donationPrice: undefined,
  restrictedProductsTypes: [],
  restrictedProductsVendors: [],
  errors: {},
  type: '' as CAMPAIGN_TYPES,
  teamId: null,
  customMarketplaceId: null,
};

export const campaignSettings = createReducer<ICampaignSettingsState>({}, initialState);

campaignSettings.on(actions.fetchCampaignSettings, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
}));
campaignSettings.on(actions.fetchCampaignSettingsSuccess, (state, payload) => ({
  ...state,
  campaignId: payload.campaignId,
  isLoading: false,
  isLoaded: true,
  minPrice: payload.minPrice,
  maxPrice: payload.maxPrice,
  giftCardPrice: payload.giftCardPrice,
  donationPrice: payload.donationPrice,
  teamId: payload.teamId,
  customMarketplaceId: payload.customMarketplaceId,
  restrictedProductsTypes: payload.restrictedProductsTypes,
  restrictedProductsVendors: payload.restrictedProductsVendors,
  isInternational: payload.isInternational,
  countryIds: payload.countryIds,
  type: payload.type,
}));
campaignSettings.on(actions.fetchCampaignSettingsFail, () => initialState);

campaignSettings.on(actions.resetCampaignSettings, () => initialState);
