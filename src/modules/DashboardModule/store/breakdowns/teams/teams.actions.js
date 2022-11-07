import {
  TEAMS_BREAKDOWN_LOAD_REQUEST,
  TEAMS_BREAKDOWN_LOAD_SUCCESS,
  TEAMS_BREAKDOWN_LOAD_FAILS,
  TEAMS_DOWNLOAD_REPORT_REQUEST,
  TEAMS_DOWNLOAD_REPORT_SUCCESS,
  TEAMS_DOWNLOAD_REPORT_FAIL,
} from './teams.types';

export const teamsLoadRequest = () => ({
  type: TEAMS_BREAKDOWN_LOAD_REQUEST,
});

export const teamsLoadSuccess = breakdown => ({
  type: TEAMS_BREAKDOWN_LOAD_SUCCESS,
  payload: breakdown,
});

export const teamsLoadFail = error => ({
  type: TEAMS_BREAKDOWN_LOAD_FAILS,
  payload: error,
});

export const teamsDownloadReportRequest = () => ({
  type: TEAMS_DOWNLOAD_REPORT_REQUEST,
});

export const teamsDownloadReportSuccess = () => ({
  type: TEAMS_DOWNLOAD_REPORT_SUCCESS,
});

export const teamsDownloadReportFail = () => ({
  type: TEAMS_DOWNLOAD_REPORT_FAIL,
});
