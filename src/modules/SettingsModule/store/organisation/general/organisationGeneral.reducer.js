import {
  ORGANISATION_SETTINGS,
  ORGANISATION_SETTINGS_UPDATE_NAME,
  ORGANISATION_SETTINGS_UPDATE_LOGO,
  ORGANISATION_SETTINGS_REMOVE_LOGO,
} from './organisationGeneral.types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  errors: {},
  settings: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORGANISATION_SETTINGS.REQUEST:
    case ORGANISATION_SETTINGS_UPDATE_NAME.REQUEST:
    case ORGANISATION_SETTINGS_UPDATE_LOGO.REQUEST:
    case ORGANISATION_SETTINGS_REMOVE_LOGO.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        errors: {},
      };
    case ORGANISATION_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        settings: action.payload,
        errors: {},
      };
    case ORGANISATION_SETTINGS.FAIL:
    case ORGANISATION_SETTINGS_UPDATE_NAME.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        errors: action.payload,
      };
    case ORGANISATION_SETTINGS_UPDATE_NAME.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: {},
        settings: {
          ...state.settings,
          name: action.payload,
        },
      };
    case ORGANISATION_SETTINGS_UPDATE_LOGO.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        errors: {},
        settings: {
          ...state.settings,
          image_url: action.payload,
        },
      };
    default:
      return state;
  }
};
