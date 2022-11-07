import * as R from 'ramda';
import { renameKeys } from '@alycecom/utils';

import { initialBreakdownState } from '../../../helpers/breakdownSelectors.helpers';
import { setLoading, setLoaded } from '../../../../../helpers/lens.helpers';

import {
  CONTACTS_BREAKDOWN_LOAD_REQUEST,
  CONTACTS_BREAKDOWN_LOAD_SUCCESS,
  CONTACTS_BREAKDOWN_LOAD_FAILS,
  CONTACTS_DOWNLOAD_REPORT_REQUEST,
  CONTACTS_DOWNLOAD_REPORT_SUCCESS,
  CONTACTS_DOWNLOAD_REPORT_FAIL,
} from './contacts.types';

export const initialState = {
  ...initialBreakdownState,
};

export const renameBreakdownKeys = renameKeys({
  gifts_sent: 'giftsSent',
  gifts_viewed: 'giftsViewed',
  gifts_accepted: 'giftsAccepted',
  meetings_booked: 'meetingsBooked',
  last_contact: 'lastContact',
  full_name: 'fullName',
});

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONTACTS_BREAKDOWN_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case CONTACTS_BREAKDOWN_LOAD_SUCCESS:
      return {
        ...state,
        ...R.compose(setLoading(false), setLoaded(true))(state),
        breakdown: action.payload.map(recipient => renameBreakdownKeys(recipient)),
      };
    case CONTACTS_BREAKDOWN_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    case CONTACTS_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case CONTACTS_DOWNLOAD_REPORT_SUCCESS:
    case CONTACTS_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    default:
      return state;
  }
};
