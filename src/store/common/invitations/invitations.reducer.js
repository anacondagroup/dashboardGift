import { INVITATIONS_AMOUNT } from './invitations.types';

export const initialState = {
  status: 'initial',
  amount: 0,
};

export const invitations = (state = initialState, action) => {
  switch (action.type) {
    case INVITATIONS_AMOUNT.SUCCESS: {
      return {
        ...state,
        status: 'fulfilled',
        amount: action.payload,
      };
    }
    case INVITATIONS_AMOUNT.FAILED: {
      return {
        ...state,
        status: 'rejected',
      };
    }
    default: {
      return state;
    }
  }
};
