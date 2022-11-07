import * as R from 'ramda';
import { renameKeys } from '@alycecom/utils';

import { initialBreakdownState } from '../../../helpers/breakdownSelectors.helpers';
import { setLoading, setLoaded } from '../../../../../helpers/lens.helpers';

import {
  TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST,
  TEAM_MEMBERS_BREAKDOWN_LOAD_SUCCESS,
  TEAM_MEMBERS_BREAKDOWN_LOAD_FAILS,
  TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST,
  TEAM_MEMBERS_DOWNLOAD_REPORT_SUCCESS,
  TEAM_MEMBERS_DOWNLOAD_REPORT_FAIL,
} from './teamMembers.types';

export const initialState = {
  ...initialBreakdownState,
};

export const renameBreakdownKeys = renameKeys({
  id: 'id',
  first_name: 'firstName',
  last_name: 'lastName',
  avatar: 'avatar',
  gifts_accepted: 'giftsAccepted',
  gifts_sent: 'giftsSent',
  gifts_viewed: 'giftsViewed',
  meetings_booked: 'meetingsBooked',
});

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case TEAM_MEMBERS_BREAKDOWN_LOAD_SUCCESS:
      return {
        ...state,
        ...R.compose(setLoading(false), setLoaded(true))(state),
        breakdown: action.payload.map(team => renameBreakdownKeys(team)),
      };
    case TEAM_MEMBERS_BREAKDOWN_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    case TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case TEAM_MEMBERS_DOWNLOAD_REPORT_SUCCESS:
    case TEAM_MEMBERS_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    default:
      return state;
  }
};
