import { setLoading } from '../../../../../helpers/lens.helpers';

import {
  CONTACTS_AVATARS_LOAD_REQUEST,
  CONTACTS_AVATARS_LOAD_SUCCESS,
  CONTACTS_AVATARS_LOAD_FAILS,
} from './contactsAvatars.types';

export const initialState = {
  avatars: [],
  isLoading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONTACTS_AVATARS_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case CONTACTS_AVATARS_LOAD_SUCCESS:
      return {
        ...state,
        avatars: action.payload,
      };
    case CONTACTS_AVATARS_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    default:
      return state;
  }
};
