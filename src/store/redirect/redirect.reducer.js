import { GET_GIFT_BY_HASH_ID_REQUEST, GET_GIFT_BY_HASH_ID_SUCCESS, RESET_GIFT } from './redirect.types';

const initialState = {
  gift: null,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GIFT_BY_HASH_ID_REQUEST:
      return {
        ...initialState,
        isLoading: true,
      };
    case GET_GIFT_BY_HASH_ID_SUCCESS:
      return {
        isLoading: false,
        gift: action.payload,
      };
    case RESET_GIFT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
