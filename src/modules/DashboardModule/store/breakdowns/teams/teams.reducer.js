import * as R from 'ramda';
import { renameKeys } from '@alycecom/utils';

import { initialBreakdownState } from '../../../helpers/breakdownSelectors.helpers';
import { setLoading, setLoaded } from '../../../../../helpers/lens.helpers';

import {
  TEAMS_BREAKDOWN_LOAD_REQUEST,
  TEAMS_BREAKDOWN_LOAD_SUCCESS,
  TEAMS_BREAKDOWN_LOAD_FAILS,
  TEAMS_DOWNLOAD_REPORT_REQUEST,
  TEAMS_DOWNLOAD_REPORT_SUCCESS,
  TEAMS_DOWNLOAD_REPORT_FAIL,
} from './teams.types';

export const initialState = {
  ...initialBreakdownState,
};

export const renameBreakdownKeys = renameKeys({
  gifts_sent: 'giftsSent',
  gifts_viewed: 'giftsViewed',
  gifts_accepted: 'giftsAccepted',
  meetings_booked: 'meetingsBooked',
});

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TEAMS_BREAKDOWN_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case TEAMS_BREAKDOWN_LOAD_SUCCESS:
      return {
        ...state,
        ...R.compose(setLoading(false), setLoaded(true))(state),
        breakdown: action.payload.map(team => renameBreakdownKeys(team)),
      };
    case TEAMS_BREAKDOWN_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    case TEAMS_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case TEAMS_DOWNLOAD_REPORT_SUCCESS:
    case TEAMS_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    default:
      return state;
  }
};
