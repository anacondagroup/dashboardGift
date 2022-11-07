import {
  TEAM_GIFT_INVITES_SETTINGS_FAIL,
  TEAM_GIFT_INVITES_SETTINGS_REQUEST,
  TEAM_GIFT_INVITES_SETTINGS_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_SUCCESS,
} from './marketplaceRestrictions.types';

const initialState = {
  restrictedVendors: {
    isLoading: false,
    availableProductsAmount: 0,
    vendors: [],
  },
  restrictedTypes: {
    isLoading: false,
    types: [],
    availableProductsAmount: 0,
  },
  settings: {
    isLoading: false,
    error: undefined,
    restrictedVendorsAmount: 0,
    restrictedTypesAmount: 0,
  },
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case TEAM_GIFT_INVITES_SETTINGS_REQUEST:
      return {
        ...state,
        settings: {
          ...state.settings,
          isLoading: true,
        },
      };
    case TEAM_GIFT_INVITES_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: {
          isLoading: false,
          restrictedTypesAmount: action.payload.restricted_types_amount,
          restrictedVendorsAmount: action.payload.restricted_vendors_amount,
        },
      };
    case TEAM_GIFT_INVITES_SETTINGS_FAIL:
      return {
        ...state,
        settings: {
          ...state.settings,
          isLoading: false,
          error: action.payload,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST:
      return {
        ...state,
        restrictedTypes: {
          ...state.restrictedTypes,
          isLoading: true,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_SUCCESS:
      return {
        ...state,
        restrictedTypes: {
          isLoading: false,
          ...action.payload,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_FAIL:
      return {
        ...state,
        restrictedTypes: {
          isLoading: false,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST:
      return {
        ...state,
        restrictedTypes: {
          ...state.restrictedTypes,
          isLoading: true,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_SUCCESS:
      return {
        ...state,
        restrictedTypes: {
          isLoading: false,
          ...action.payload,
        },
        settings: {
          ...state.settings,
          restrictedTypesAmount: action.payload.types.filter(item => item.is_restricted).length,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_FAIL:
      return {
        ...state,
        restrictedTypes: {
          isLoading: false,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST:
      return {
        ...state,
        restrictedVendors: {
          ...state.restrictedVendors,
          isLoading: true,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_SUCCESS:
      return {
        ...state,
        restrictedVendors: {
          ...state.restrictedVendors,
          ...action.payload,
          isLoading: false,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_FAIL:
      return {
        ...state,
        restrictedVendors: {
          ...state.restrictedVendors,
          isLoading: false,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST:
      return {
        ...state,
        restrictedVendors: {
          ...state.restrictedVendors,
          isLoading: true,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_SUCCESS:
      return {
        ...state,
        restrictedVendors: {
          isLoading: false,
          ...action.payload,
        },
        settings: {
          ...state.settings,
          restrictedVendorsAmount: action.payload.vendors.filter(item => item.is_restricted).length,
        },
      };
    case TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_FAIL:
      return {
        ...state,
        restrictedVendors: {
          ...state.restrictedVendors,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};
