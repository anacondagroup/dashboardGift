import { UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE, LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE } from './landingPage.types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  settings: {
    header: '',
    message: '',
  },
  errors: {},
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST:
    case UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
      };
    case LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.SUCCESS:
      return {
        ...state,
        settings: payload,
        isLoading: false,
        isLoaded: true,
      };
    case LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
      };
    case UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: payload,
      };
    default:
      return state;
  }
};
