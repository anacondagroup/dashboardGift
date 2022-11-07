import { PROFILE_LOAD_REQUEST, PROFILE_LOAD_SUCCESS, PROFILE_LOAD_FAIL, RESET_PROFILE_STATE } from './profile.types';

export const initialState = {
  isLoading: false,
  error: null,
  id: null,
  avatar: '',
  email: '',
  firstName: '',
  fullName: '',
  lastName: '',
  employment: '',
  education: '',
  location: '',
  phoneNumber: '',
  discoveryNotes: null,
  researchTags: [],
  countryId: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case PROFILE_LOAD_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        ...action.payload,
      };
    case PROFILE_LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case RESET_PROFILE_STATE:
      return initialState;
    default:
      return state;
  }
};
