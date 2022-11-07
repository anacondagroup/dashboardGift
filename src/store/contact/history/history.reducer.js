import * as R from 'ramda';
import { renameKeys } from '@alycecom/utils';

import { setLoading } from '../../../helpers/lens.helpers';

import { HISTORY_LOAD_REQUEST, HISTORY_LOAD_SUCCESS, HISTORY_LOAD_FAIL } from './history.types';

export const initialState = {
  isLoading: false,
  error: null,
  gifts: [],
};

export const mapGift = R.compose(
  renameKeys({
    sent_as: 'sentAs',
    sent_by: 'sentBy',
    shipping_info: 'shippingInfo',
    status_id: 'statusId',
    meeting_notes: 'meetingNotes',
  }),
);

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case HISTORY_LOAD_SUCCESS:
      return {
        ...state,
        ...setLoading(false, state),
        gifts: R.map(mapGift, action.payload),
        error: null,
      };
    case HISTORY_LOAD_FAIL:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    default:
      return state;
  }
};
