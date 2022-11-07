import {
  OVERVIEW_LOAD_REQUEST,
  OVERVIEW_LOAD_SUCCESS,
  OVERVIEW_LOAD_FAIL,
  OVERVIEW_DOWNLOAD_REPORT_REQUEST,
  OVERVIEW_DOWNLOAD_REPORT_SUCCESS,
  OVERVIEW_DOWNLOAD_REPORT_FAIL,
} from './overview.types';

export const overviewLoadRequest = options => ({
  type: OVERVIEW_LOAD_REQUEST,
  payload: options,
});

export const overviewLoadSuccess = payload => ({
  type: OVERVIEW_LOAD_SUCCESS,
  payload,
});

export const overviewLoadFail = payload => ({
  type: OVERVIEW_LOAD_FAIL,
  payload,
});

export const overviewDownloadReportRequest = payload => ({
  type: OVERVIEW_DOWNLOAD_REPORT_REQUEST,
  payload,
});

export const overviewDownloadReportSuccess = () => ({
  type: OVERVIEW_DOWNLOAD_REPORT_SUCCESS,
});

export const overviewDownloadReportFail = () => ({
  type: OVERVIEW_DOWNLOAD_REPORT_FAIL,
});
