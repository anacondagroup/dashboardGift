import {
  CAMPAIGNS_BREAKDOWN_LOAD_REQUEST,
  CAMPAIGNS_BREAKDOWN_LOAD_SUCCESS,
  CAMPAIGNS_BREAKDOWN_LOAD_FAILS,
  CAMPAIGNS_DOWNLOAD_REPORT_REQUEST,
  CAMPAIGNS_DOWNLOAD_REPORT_SUCCESS,
  CAMPAIGNS_DOWNLOAD_REPORT_FAIL,
} from './campaigns.types';

export const campaignsLoadRequest = options => ({
  type: CAMPAIGNS_BREAKDOWN_LOAD_REQUEST,
  payload: options,
});

export const campaignsLoadSuccess = breakdown => ({
  type: CAMPAIGNS_BREAKDOWN_LOAD_SUCCESS,
  payload: breakdown,
});

export const campaignsLoadFail = error => ({
  type: CAMPAIGNS_BREAKDOWN_LOAD_FAILS,
  payload: error,
});

export const campaignsDownloadReportRequest = options => ({
  type: CAMPAIGNS_DOWNLOAD_REPORT_REQUEST,
  payload: options,
});
export const campaignsDownloadReportSuccess = () => ({
  type: CAMPAIGNS_DOWNLOAD_REPORT_SUCCESS,
});
export const campaignsDownloadReportFail = () => ({
  type: CAMPAIGNS_DOWNLOAD_REPORT_FAIL,
});
