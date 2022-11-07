import * as R from 'ramda';
import { renameKeys } from '@alycecom/utils';

import { initialBreakdownState } from '../../../helpers/breakdownSelectors.helpers';
import { setLoading, setLoaded } from '../../../../../helpers/lens.helpers';

import {
  CAMPAIGNS_BREAKDOWN_LOAD_REQUEST,
  CAMPAIGNS_BREAKDOWN_LOAD_SUCCESS,
  CAMPAIGNS_BREAKDOWN_LOAD_FAILS,
  CAMPAIGNS_DOWNLOAD_REPORT_REQUEST,
  CAMPAIGNS_DOWNLOAD_REPORT_SUCCESS,
  CAMPAIGNS_DOWNLOAD_REPORT_FAIL,
} from './campaigns.types';

export const initialState = {
  ...initialBreakdownState,
};

export const renameBreakdownKeys = renameKeys({
  gifts_sent: 'giftsSent',
  gifts_viewed: 'giftsViewed',
  gifts_accepted: 'giftsAccepted',
  meetings_booked: 'meetingsBooked',
  type: 'type',
});

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CAMPAIGNS_BREAKDOWN_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case CAMPAIGNS_BREAKDOWN_LOAD_SUCCESS:
      return {
        ...state,
        ...R.compose(setLoading(false), setLoaded(true))(state),
        breakdown: action.payload.map(campaign => renameBreakdownKeys(campaign)),
      };
    case CAMPAIGNS_BREAKDOWN_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    case CAMPAIGNS_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case CAMPAIGNS_DOWNLOAD_REPORT_SUCCESS:
    case CAMPAIGNS_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    default:
      return state;
  }
};
