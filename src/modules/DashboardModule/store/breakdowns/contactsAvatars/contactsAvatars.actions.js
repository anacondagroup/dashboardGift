import {
  CONTACTS_AVATARS_LOAD_REQUEST,
  CONTACTS_AVATARS_LOAD_SUCCESS,
  CONTACTS_AVATARS_LOAD_FAILS,
} from './contactsAvatars.types';

export const contactsAvatarsLoadRequest = ids => ({
  type: CONTACTS_AVATARS_LOAD_REQUEST,
  payload: ids,
});

export const contactsAvatarsLoadSuccess = breakdown => ({
  type: CONTACTS_AVATARS_LOAD_SUCCESS,
  payload: breakdown,
});

export const contactsAvatarsLoadFail = error => ({
  type: CONTACTS_AVATARS_LOAD_FAILS,
  payload: error,
});
