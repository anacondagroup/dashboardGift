import {
  LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS,
  LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES,
  UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES,
  UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS,
} from './swagInvites.types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  settings: {},
  errors: {},
  productTypes: [],
  defaultProductId: 0,
  productTypesLoading: false,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.REQUEST:
    case UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.REQUEST:
    case UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.REQUEST:
    case UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
      };
    case LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST:
      return {
        ...state,
        productTypes: [],
        productTypesLoading: true,
      };
    case LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.SUCCESS:
      return {
        ...state,
        productTypes: payload.products,
        defaultProductId: payload.default_product_id,
        productTypesLoading: false,
      };
    case LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.FAIL:
      return {
        ...state,
        productTypesLoading: false,
      };
    case LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        settings: payload.settings,
      };
    case UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: {},
        settings: {
          ...state.settings,
          ...payload.budget,
        },
      };
    case UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        settings: {
          ...state.settings,
          restricted_product_ids: payload,
        },
        errors: {},
      };
    case UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: payload,
      };
    case UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: {},
        settings: {
          ...state.settings,
          ...payload.actions,
        },
      };
    case LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.FAIL:
    case UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.FAIL:
    case UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        errors: payload,
      };

    default:
      return state;
  }
};
