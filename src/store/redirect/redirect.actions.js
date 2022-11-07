import {
  GET_GIFT_BY_HASH_ID_ERROR,
  GET_GIFT_BY_HASH_ID_REQUEST,
  GET_GIFT_BY_HASH_ID_SUCCESS,
  RESET_GIFT,
} from './redirect.types';

export const getGiftByHashId = hashId => ({
  type: GET_GIFT_BY_HASH_ID_REQUEST,
  payload: hashId,
});
export const getGiftByHashIdSuccess = gift => ({
  type: GET_GIFT_BY_HASH_ID_SUCCESS,
  payload: gift,
});

export const getGiftByHashIdError = error => ({
  type: GET_GIFT_BY_HASH_ID_ERROR,
  payload: error,
});

export const resetGift = () => ({
  type: RESET_GIFT,
});
