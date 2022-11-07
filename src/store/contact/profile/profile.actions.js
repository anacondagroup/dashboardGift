import { PROFILE_LOAD_REQUEST, PROFILE_LOAD_SUCCESS, PROFILE_LOAD_FAIL, RESET_PROFILE_STATE } from './profile.types';
import { transformContactInfo } from './profile.helpers';

export const profileLoadRequest = ({ giftId = null, contactId = null }) => ({
  type: PROFILE_LOAD_REQUEST,
  payload: { giftId, contactId },
});

export const profileLoadSuccess = profile => ({
  type: PROFILE_LOAD_SUCCESS,
  payload: transformContactInfo(profile),
});

export const profileLoadFail = error => ({
  type: PROFILE_LOAD_FAIL,
  payload: error,
});

export const resetProfile = () => ({
  type: RESET_PROFILE_STATE,
});
