import { set1t1CampaignCustomMarketplaceId } from '../giftInvites/giftInvites.actions';

import {
  COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST,
  COMMON_CAMPAIGN_SETTINGS_DATA_SUCCESS,
  COMMON_CAMPAIGN_SETTINGS_DATA_FAIL,
  COMMON_CAMPAIGN_SETTINGS_CLEAR_DATA,
} from './commonData.types';

const initialState = {
  campaign: undefined,
  isLoading: false,
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case COMMON_CAMPAIGN_SETTINGS_DATA_SUCCESS:
      return {
        ...state,
        campaign: payload,
        isLoading: false,
      };
    case COMMON_CAMPAIGN_SETTINGS_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case COMMON_CAMPAIGN_SETTINGS_CLEAR_DATA:
      return {
        ...initialState,
      };
    case set1t1CampaignCustomMarketplaceId.fulfilled.getType(): {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          customMarketplaceId: payload.customMarketplaceId,
        },
      };
    }

    default:
      return state;
  }
};
