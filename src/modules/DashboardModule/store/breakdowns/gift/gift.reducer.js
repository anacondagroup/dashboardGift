import * as R from 'ramda';

import { initialBreakdownState } from '../../../helpers/breakdownSelectors.helpers';
import { setLoading, setLoaded } from '../../../../../helpers/lens.helpers';

import {
  GIFT_BREAKDOWN_LOAD_REQUEST,
  GIFT_BREAKDOWN_LOAD_SUCCESS,
  GIFT_BREAKDOWN_LOAD_FAILS,
  GIFT_DOWNLOAD_REPORT_REQUEST,
  GIFT_DOWNLOAD_REPORT_SUCCESS,
  GIFT_DOWNLOAD_REPORT_FAIL,
  GIFT_DOWNLOAD_RECEIPTS_REQUEST,
  GIFT_DOWNLOAD_RECEIPTS_SUCCESS,
  GIFT_DOWNLOAD_RECEIPTS_FAIL,
  GIFT_BREAKDOWN_CLEAR,
  GIFT_BREAKDOWN_TABLE_LOAD_REQUEST,
  GIFT_BREAKDOWN_TABLE_LOAD_SUCCESS,
  GIFT_BREAKDOWN_TABLE_LOAD_FAILS,
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST,
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_SUCCESS,
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_FAIL,
} from './gift.types';

export const initialState = {
  ...initialBreakdownState,
  isReceiptsLoading: false,
};

export const mapBreakdown = gift =>
  gift && (gift.batchName || gift.sentProduct)
    ? gift
    : {
        id: gift.id || '',
        recipientId: gift.recipient_id,
        fullName: gift.recipient_full_name || '',
        company: gift.recipient_company || '',
        gift: gift.product ? gift.product.name : '',
        campaign: gift.campaign || '',
        campaignId: gift.campaign_id,
        sentBy: gift.sent_as || '',
        method: gift.gift_invitation_type || '',
        sentOn: gift.sent_on || '',
        giftStatus: gift.status.name || '',
        giftStatusId: gift.status.id || '',
        canChooseOptions: gift.can_choose_options,
        teamId: gift.team_id,
        scheduledAt: gift.scheduled_at || null,
      };

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GIFT_DOWNLOAD_RECEIPTS_REQUEST:
      return {
        ...state,
        isReceiptsLoading: true,
      };
    case GIFT_DOWNLOAD_RECEIPTS_FAIL:
    case GIFT_DOWNLOAD_RECEIPTS_SUCCESS:
      return {
        ...state,
        isReceiptsLoading: false,
      };
    case GIFT_BREAKDOWN_TABLE_LOAD_REQUEST:
    case GIFT_BREAKDOWN_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };

    case GIFT_BREAKDOWN_TABLE_LOAD_SUCCESS:
    case GIFT_BREAKDOWN_LOAD_SUCCESS:
      return {
        ...state,
        ...R.compose(setLoading(false), setLoaded(true))(state),
        breakdown: action.payload.gifts.map(mapBreakdown),
        pagination: action.payload.meta.pagination,
      };

    case GIFT_BREAKDOWN_TABLE_LOAD_FAILS:
    case GIFT_BREAKDOWN_LOAD_FAILS:
      return {
        ...state,
        ...setLoading(false, state),
        error: action.payload,
      };
    case GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST:
    case GIFT_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case GIFT_BREAKDOWN_DOWNLOAD_REPORT_SUCCESS:
    case GIFT_DOWNLOAD_REPORT_SUCCESS:
    case GIFT_BREAKDOWN_DOWNLOAD_REPORT_FAIL:
    case GIFT_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    case GIFT_BREAKDOWN_CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
