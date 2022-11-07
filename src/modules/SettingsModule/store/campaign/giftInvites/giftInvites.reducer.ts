import { createReducer } from 'redux-act';

import {
  campaignGiftInvitesSettingsLoadRequest,
  campaignGiftUpdateBudgetRequest,
  campaignGiftUpdateRequiredActionsRequest,
  campaignGiftUpdateExpirationRequest,
  campaignGiftUpdateRedirectRequest,
  campaignGiftUpdateVideoMessageRequest,
  campaignGiftInvitesSettingsLoadSuccess,
  campaignGiftUpdateBudgetSuccess,
  campaignGiftUpdateRequiredActionsSuccess,
  campaignGiftUpdateExpirationSuccess,
  campaignGiftUpdateRedirectSuccess,
  campaignGiftUpdateVideoMessageSuccess,
  campaignGiftInvitesSettingsLoadFail,
  campaignGiftUpdateBudgetFail,
  campaignGiftUpdateExpirationFail,
  campaignGiftUpdateRequiredActionsFail,
  campaignGiftUpdateRedirectFail,
  campaignGiftUpdateVideoMessageFail,
  campaignGiftUpdateVideoMessageCleanErrors,
  loadCampaignVendorsRequest,
  saveCampaignVendorRestrictionsRequest,
  loadCampaignVendorsSuccess,
  saveCampaignVendorRestrictionsSuccess,
  setRestrictedCampaignVendors,
  loadCampaignTypesRequest,
  saveCampaignTypeRestrictionsRequest,
  loadCampaignTypesSuccess,
  saveCampaignTypeRestrictionsSuccess,
  setRestrictedCampaignTypes,
  set1t1CampaignCustomMarketplaceId,
} from './giftInvites.actions';
import { IGiftInvitesCampaignSettings, IGiftType, IGiftVendor } from './giftInvites.types';

export interface ISettingsGiftInvitesState {
  isLoading: boolean;
  isLoaded: boolean;
  campaign?: IGiftInvitesCampaignSettings;
  types: {
    isLoading: boolean;
    giftTypes: IGiftType[];
  };
  vendors: {
    isLoading: boolean;
    giftVendors: IGiftVendor[];
    availableProductsCount?: number;
  };
  errors: Record<string, unknown>;
}

export const initialState: ISettingsGiftInvitesState = {
  isLoading: false,
  isLoaded: false,
  campaign: undefined,
  types: {
    isLoading: false,
    giftTypes: [],
  },
  vendors: {
    isLoading: false,
    giftVendors: [],
    availableProductsCount: undefined,
  },
  errors: {},
};

const reducer = createReducer<ISettingsGiftInvitesState>({}, initialState);

reducer.on(campaignGiftInvitesSettingsLoadRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));
reducer.on(campaignGiftUpdateBudgetRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));
reducer.on(campaignGiftUpdateRequiredActionsRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));
reducer.on(campaignGiftUpdateExpirationRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));
reducer.on(campaignGiftUpdateRedirectRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));
reducer.on(campaignGiftUpdateVideoMessageRequest, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));

reducer.on(campaignGiftInvitesSettingsLoadSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  campaign: payload,
}));
reducer.on(campaignGiftUpdateBudgetSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  errors: {},
  campaign: state.campaign
    ? {
        ...state.campaign,
        enterprise_min_price: payload.giftMinPrice,
        enterprise_max_price: payload.giftMaxPrice,
        enterprise_donation_price: payload.giftDonationPrice,
        enterprise_gift_card_price: payload.giftCardPrice,
      }
    : undefined,
}));
reducer.on(campaignGiftUpdateRequiredActionsSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  errors: {},
  campaign: state.campaign
    ? {
        ...state.campaign,
        can_override_required_actions: +payload.can_override_required_actions,
        required_actions: payload.required_actions,
      }
    : undefined,
}));
reducer.on(campaignGiftUpdateExpirationSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  errors: {},
  campaign: state.campaign
    ? {
        ...state.campaign,
        gift_expiration: payload.period,
      }
    : undefined,
}));
reducer.on(campaignGiftUpdateRedirectSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  errors: {},
  campaign: state.campaign
    ? {
        ...state.campaign,
        customisation: {
          ...state.campaign.customisation,
          redirect_url: payload.redirect_url,
          redirect_header: payload.redirect_header,
          redirect_message: payload.redirect_message,
          redirect_button: payload.redirect_button,
        },
      }
    : undefined,
}));
reducer.on(campaignGiftUpdateVideoMessageSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  errors: {},
  campaign: state.campaign
    ? {
        ...state.campaign,
        customisation: {
          ...state.campaign.customisation,
          ...payload,
        },
      }
    : undefined,
}));

reducer.on(campaignGiftInvitesSettingsLoadFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));
reducer.on(campaignGiftUpdateBudgetFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));
reducer.on(campaignGiftUpdateExpirationFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));
reducer.on(campaignGiftUpdateRequiredActionsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));
reducer.on(campaignGiftUpdateRedirectFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));
reducer.on(campaignGiftUpdateVideoMessageFail, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors: payload,
}));

reducer.on(campaignGiftUpdateVideoMessageCleanErrors, (state, payload) => ({
  ...state,
  errors: payload,
}));

reducer.on(loadCampaignVendorsRequest, state => ({
  ...state,
  vendors: {
    ...state.vendors,
    isLoading: true,
  },
}));
reducer.on(saveCampaignVendorRestrictionsRequest, state => ({
  ...state,
  vendors: {
    ...state.vendors,
    isLoading: true,
  },
}));

reducer.on(loadCampaignVendorsSuccess, (state, payload) => ({
  ...state,
  vendors: {
    ...state.vendors,
    isLoading: false,
    giftVendors: payload.vendors,
    availableProductsCount: payload.availableProductsCount,
  },
}));
reducer.on(saveCampaignVendorRestrictionsSuccess, (state, payload) => ({
  ...state,
  vendors: {
    ...state.vendors,
    isLoading: false,
    giftVendors: payload.vendors,
    availableProductsCount: payload.availableProductsCount,
  },
}));

reducer.on(setRestrictedCampaignVendors, (state, payload) => ({
  ...state,
  vendors: {
    ...state.vendors,
    giftVendors: payload,
  },
}));

reducer.on(loadCampaignTypesRequest, state => ({
  ...state,
  types: {
    ...state.types,
    isLoading: true,
  },
}));
reducer.on(saveCampaignTypeRestrictionsRequest, state => ({
  ...state,
  types: {
    ...state.types,
    isLoading: true,
  },
}));

reducer.on(loadCampaignTypesSuccess, (state, payload) => ({
  ...state,
  types: {
    ...state.types,
    isLoading: false,
    giftTypes: payload,
  },
}));
reducer.on(saveCampaignTypeRestrictionsSuccess, (state, payload) => ({
  ...state,
  types: {
    ...state.types,
    isLoading: false,
    giftTypes: payload,
  },
}));

reducer.on(setRestrictedCampaignTypes, (state, payload) => ({
  ...state,
  types: {
    ...state.types,
    giftTypes: payload,
  },
}));

reducer.on(set1t1CampaignCustomMarketplaceId.pending, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
}));

reducer.on(set1t1CampaignCustomMarketplaceId.fulfilled, state => ({
  ...state,
  isLoading: false,
  isLoaded: true,
}));

export { reducer };
