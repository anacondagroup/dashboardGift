import {
  LOAD_TEAM_INVITATION_METHODS_SETTINGS,
  UPDATE_TEAM_INVITATION_METHODS_SETTINGS,
} from './invitationMethods.types';

const initialState = {
  isLoading: false,
  invitationMethods: [],
  errors: null,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_TEAM_INVITATION_METHODS_SETTINGS.REQUEST:
    case UPDATE_TEAM_INVITATION_METHODS_SETTINGS.REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_TEAM_INVITATION_METHODS_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        invitationMethods: payload,
      };
    case UPDATE_TEAM_INVITATION_METHODS_SETTINGS.SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case LOAD_TEAM_INVITATION_METHODS_SETTINGS.FAIL:
    case UPDATE_TEAM_INVITATION_METHODS_SETTINGS.FAIL:
      return {
        ...state,
        isLoading: false,
        errors: payload,
      };

    default:
      return state;
  }
};
