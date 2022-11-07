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
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_SUCCESS,
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_FAIL,
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST,
} from './gift.types';

export const giftBreakdownRequest = options => ({
  type: GIFT_BREAKDOWN_TABLE_LOAD_REQUEST,
  payload: options,
});

export const giftBreakdownSuccess = breakdown => ({
  type: GIFT_BREAKDOWN_TABLE_LOAD_SUCCESS,
  payload: breakdown,
});

export const giftBreakdownLoadFail = error => ({
  type: GIFT_BREAKDOWN_TABLE_LOAD_FAILS,
  payload: error,
});

export const giftLoadRequest = options => ({
  type: GIFT_BREAKDOWN_LOAD_REQUEST,
  payload: options,
});

export const giftLoadSuccess = breakdown => ({
  type: GIFT_BREAKDOWN_LOAD_SUCCESS,
  payload: breakdown,
});

export const giftLoadFail = error => ({
  type: GIFT_BREAKDOWN_LOAD_FAILS,
  payload: error,
});

export const giftBreakdownDownloadReportRequest = options => ({
  type: GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST,
  payload: options,
});

export const giftBreakdownDownloadReportSuccess = () => ({
  type: GIFT_BREAKDOWN_DOWNLOAD_REPORT_SUCCESS,
});

export const giftBreakdownDownloadReportFail = () => ({
  type: GIFT_BREAKDOWN_DOWNLOAD_REPORT_FAIL,
});

export const giftDownloadReportRequest = options => ({
  type: GIFT_DOWNLOAD_REPORT_REQUEST,
  payload: options,
});

export const giftDownloadReportSuccess = () => ({
  type: GIFT_DOWNLOAD_REPORT_SUCCESS,
});

export const giftDownloadReportFail = () => ({
  type: GIFT_DOWNLOAD_REPORT_FAIL,
});

export const giftDownloadReceiptsRequest = options => ({
  type: GIFT_DOWNLOAD_RECEIPTS_REQUEST,
  payload: options,
});

export const giftDownloadReceiptsSuccess = () => ({
  type: GIFT_DOWNLOAD_RECEIPTS_SUCCESS,
});

export const giftDownloadReceiptsFail = () => ({
  type: GIFT_DOWNLOAD_RECEIPTS_FAIL,
});

export const giftBreakDownClear = () => ({
  type: GIFT_BREAKDOWN_CLEAR,
});
