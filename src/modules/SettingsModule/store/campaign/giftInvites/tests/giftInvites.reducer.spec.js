import { reducer, initialState } from '../giftInvites.reducer';
import {
  campaignGiftInvitesSettingsLoadFail,
  campaignGiftInvitesSettingsLoadRequest,
  campaignGiftInvitesSettingsLoadSuccess,
  campaignGiftUpdateBudgetFail,
  campaignGiftUpdateBudgetRequest,
  campaignGiftUpdateBudgetSuccess,
  campaignGiftUpdateExpirationFail,
  campaignGiftUpdateExpirationRequest,
  campaignGiftUpdateExpirationSuccess,
  campaignGiftUpdateRedirectFail,
  campaignGiftUpdateRedirectRequest,
  campaignGiftUpdateRedirectSuccess,
  campaignGiftUpdateRequiredActionsFail,
  campaignGiftUpdateRequiredActionsRequest,
  campaignGiftUpdateRequiredActionsSuccess,
  campaignGiftUpdateVideoMessageCleanErrors,
  campaignGiftUpdateVideoMessageFail,
  campaignGiftUpdateVideoMessageRequest,
  campaignGiftUpdateVideoMessageSuccess,
  loadCampaignTypesRequest,
  loadCampaignTypesSuccess,
  loadCampaignVendorsRequest,
  loadCampaignVendorsSuccess,
  saveCampaignTypeRestrictionsRequest,
  saveCampaignTypeRestrictionsSuccess,
  saveCampaignVendorRestrictionsRequest,
  saveCampaignVendorRestrictionsSuccess,
  setRestrictedCampaignTypes,
  setRestrictedCampaignVendors,
} from '../giftInvites.actions';
import { CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';

import { giftInvitesCampaignSettingsMock } from './giftInvites.mock';
import { ProductTypes } from '../../../settings.types';

describe('GiftInvites Reducer', () => {
  it('Should return initial state', () => {
    expect(reducer(initialState, { type: 'SOME_TYPE' })).toEqual(initialState);
  });

  it.each`
    actionCreator                               | actionType
    ${campaignGiftInvitesSettingsLoadRequest}   | ${campaignGiftInvitesSettingsLoadRequest.getType()}
    ${campaignGiftUpdateBudgetRequest}          | ${campaignGiftUpdateBudgetRequest.getType()}
    ${campaignGiftUpdateRequiredActionsRequest} | ${campaignGiftUpdateRequiredActionsRequest.getType()}
    ${campaignGiftUpdateExpirationRequest}      | ${campaignGiftUpdateExpirationRequest.getType()}
    ${campaignGiftUpdateRedirectRequest}        | ${campaignGiftUpdateRedirectRequest.getType()}
    ${campaignGiftUpdateVideoMessageRequest}    | ${campaignGiftUpdateVideoMessageRequest.getType()}
  `('Should handle $actionType action', ({ actionCreator }) => {
    expect(reducer(initialState, actionCreator(10))).toEqual({
      ...initialState,
      isLoading: true,
      isLoaded: false,
      errors: {},
    });
  });

  it(`Should handle ${campaignGiftInvitesSettingsLoadSuccess.getType()}`, () => {
    const action = campaignGiftInvitesSettingsLoadSuccess(giftInvitesCampaignSettingsMock);
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      isLoaded: true,
      campaign: giftInvitesCampaignSettingsMock,
    });
  });

  describe('campaign has been set', () => {
    const setupCampaign = giftInvitesPayload => {
      const action = campaignGiftInvitesSettingsLoadSuccess({
        giftInvitesCampaignSettingsMock,
        ...giftInvitesPayload,
      });
      return reducer(initialState, action);
    };

    it(`Should handle ${campaignGiftUpdateBudgetSuccess.getType()}`, () => {
      const payload = {
        campaignId: 10,
        campaignType: CAMPAIGN_TYPES.ACTIVATE,
        giftMinPrice: 100,
        giftMaxPrice: 200,
        giftCardPrice: 200,
        giftDonationPrice: 200,
      };
      const intermediateState = setupCampaign();
      const action = campaignGiftUpdateBudgetSuccess(payload);
      expect(reducer(intermediateState, action)).toEqual({
        ...intermediateState,
        isLoading: false,
        isLoaded: true,
        errors: {},
        campaign: {
          ...intermediateState.campaign,
          enterprise_min_price: payload.giftMinPrice,
          enterprise_max_price: payload.giftMaxPrice,
          enterprise_donation_price: payload.giftCardPrice,
          enterprise_gift_card_price: payload.giftDonationPrice,
        },
      });
    });

    it(`Should handle ${campaignGiftUpdateRequiredActionsSuccess.getType()}`, () => {
      const intermediateState = setupCampaign();
      const payload = {
        campaign_id: 10,
        can_override_required_actions: true,
        required_actions: {
          capture_affidavit: false,
          capture_date: false,
          capture_email: false,
          capture_phone: true,
          capture_question: true,
          gifter_affidavit: false,
          gifter_question: false,
        },
      };
      const action = campaignGiftUpdateRequiredActionsSuccess(payload);
      expect(reducer(intermediateState, action)).toEqual({
        ...intermediateState,
        isLoading: false,
        isLoaded: true,
        errors: {},
        campaign: {
          ...intermediateState.campaign,
          can_override_required_actions: 1,
          required_actions: payload.required_actions,
        },
      });
    });

    it(`Should handle ${campaignGiftUpdateExpirationSuccess.getType()}`, () => {
      const intermediateState = setupCampaign();
      const payload = { campaignId: 10, period: 90 };
      const action = campaignGiftUpdateExpirationSuccess(payload);
      expect(reducer(intermediateState, action)).toEqual({
        ...intermediateState,
        isLoading: false,
        isLoaded: true,
        errors: {},
        campaign: {
          ...intermediateState.campaign,
          gift_expiration: payload.period,
        },
      });
    });

    it(`Should handle ${campaignGiftUpdateRedirectSuccess.getType()}`, () => {
      const intermediateState = setupCampaign();
      const payload = {
        campaign_id: 10,
        redirect_url: 'string',
        redirect_header: 'string',
        redirect_message: 'string',
        redirect_button: 'string',
        redirect_confirm: true,
      };
      const action = campaignGiftUpdateRedirectSuccess(payload);
      expect(reducer(intermediateState, action)).toEqual({
        ...intermediateState,
        isLoading: false,
        isLoaded: true,
        errors: {},
        campaign: {
          ...intermediateState.campaign,
          customisation: {
            redirect_url: payload.redirect_url,
            redirect_header: payload.redirect_header,
            redirect_message: payload.redirect_message,
            redirect_button: payload.redirect_button,
          },
        },
      });
    });

    it(`Should handle ${campaignGiftUpdateVideoMessageSuccess.getType()}`, () => {
      const intermediateState = setupCampaign();
      const payload = {
        campaign_id: 10,
        recipient_video: 'string',
        can_override_recipient_video: true,
        recipient_video_type: 'string',
        vidyard_video: 'string',
        vidyard_image: 'string',
      };
      const action = campaignGiftUpdateVideoMessageSuccess(payload);
      expect(reducer(intermediateState, action)).toEqual({
        ...intermediateState,
        isLoading: false,
        isLoaded: true,
        errors: {},
        campaign: {
          ...intermediateState.campaign,
          customisation: {
            ...intermediateState.campaign.customisation,
            ...payload,
          },
        },
      });
    });
  });

  it.each`
    actionCreator                            | actionType
    ${campaignGiftInvitesSettingsLoadFail}   | ${campaignGiftInvitesSettingsLoadFail.getType()}
    ${campaignGiftUpdateBudgetFail}          | ${campaignGiftUpdateBudgetFail.getType()}
    ${campaignGiftUpdateExpirationFail}      | ${campaignGiftUpdateExpirationFail.getType()}
    ${campaignGiftUpdateRequiredActionsFail} | ${campaignGiftUpdateRequiredActionsFail.getType()}
    ${campaignGiftUpdateRedirectFail}        | ${campaignGiftUpdateRedirectFail.getType()}
    ${campaignGiftUpdateVideoMessageFail}    | ${campaignGiftUpdateVideoMessageFail.getType()}
  `('Should handle $actionType', ({ actionCreator }) => {
    const error = new Error();
    expect(reducer(initialState, actionCreator(error))).toEqual({
      ...initialState,
      isLoading: false,
      isLoaded: false,
      errors: error,
    });
  });

  it(`Should handle ${campaignGiftUpdateVideoMessageCleanErrors.getType()}`, () => {
    const error = new Error();
    const action = campaignGiftUpdateVideoMessageCleanErrors(error);
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      errors: error,
    });
  });

  describe('Vendors state', () => {
    it.each`
      actionCreator                            | actionType
      ${loadCampaignVendorsRequest}            | ${loadCampaignVendorsRequest.getType()}
      ${saveCampaignVendorRestrictionsRequest} | ${saveCampaignVendorRestrictionsRequest.getType()}
    `(`Should handle $actionType`, ({ actionCreator }) => {
      expect(reducer(initialState, actionCreator(10))).toEqual({
        ...initialState,
        vendors: {
          ...initialState.vendors,
          isLoading: true,
        },
      });
    });

    it.each`
      actionCreator                            | actionType
      ${loadCampaignVendorsSuccess}            | ${loadCampaignVendorsSuccess.getType()}
      ${saveCampaignVendorRestrictionsSuccess} | ${saveCampaignVendorRestrictionsSuccess.getType()}
    `(`Should handle $actionType`, ({ actionCreator }) => {
      const giftVendor = {
        id: 15,
        name: 'gift vendor',
        type: 'some',
        description: 'string',
        is_campaign_restricted: false,
        is_team_restricted: false,
        logo_url: 'string',
        countries: ['string'],
      };
      const payload = {
        vendors: [giftVendor],
        availableProductsCount: 10,
      };
      expect(reducer(initialState, actionCreator(payload))).toEqual({
        ...initialState,
        vendors: {
          ...initialState.vendors,
          isLoading: false,
          giftVendors: payload.vendors,
          availableProductsCount: payload.availableProductsCount,
        },
      });
    });

    it(`Should handle ${setRestrictedCampaignVendors.getType()}`, () => {
      const giftVendor = {
        id: 15,
        name: 'gift vendor',
        type: 'some',
        description: 'string',
        is_campaign_restricted: false,
        is_team_restricted: false,
        logo_url: 'string',
        countries: ['string'],
      };
      const payload = [giftVendor];
      const action = setRestrictedCampaignVendors(payload);
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        vendors: {
          ...initialState.vendors,
          giftVendors: payload,
        },
      });
    });
  });

  describe('Types state', () => {
    it.each`
      actionCreator                          | actionType
      ${loadCampaignTypesRequest}            | ${loadCampaignTypesRequest.getType()}
      ${saveCampaignTypeRestrictionsRequest} | ${saveCampaignTypeRestrictionsRequest.getType()}
    `(`Should handle $actionType`, ({ actionCreator }) => {
      expect(reducer(initialState, actionCreator(10))).toEqual({
        ...initialState,
        types: {
          ...initialState.types,
          isLoading: true,
        },
      });
    });

    it.each`
      actionCreator                          | actionType
      ${loadCampaignTypesSuccess}            | ${loadCampaignTypesSuccess.getType()}
      ${saveCampaignTypeRestrictionsSuccess} | ${saveCampaignTypeRestrictionsSuccess.getType()}
    `(`Should handle $actionType`, ({ actionCreator }) => {
      const giftTypes = {
        id: ProductTypes.donation,
        name: 'Product',
        is_campaign_restricted: false,
        is_team_restricted: false,
      };
      const payload = [giftTypes];
      expect(reducer(initialState, actionCreator(payload))).toEqual({
        ...initialState,
        types: {
          ...initialState.types,
          isLoading: false,
          giftTypes: payload,
        },
      });
    });

    it(`Should handle ${setRestrictedCampaignTypes.getType()}`, () => {
      const giftTypes = {
        id: ProductTypes.donation,
        name: 'Product',
        is_campaign_restricted: false,
        is_team_restricted: false,
      };
      const payload = [giftTypes];
      const action = setRestrictedCampaignTypes(payload);
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        types: {
          ...initialState.types,
          giftTypes: payload,
        },
      });
    });
  });
});
