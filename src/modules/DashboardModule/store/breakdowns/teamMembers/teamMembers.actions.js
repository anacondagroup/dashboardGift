import {
  TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST,
  TEAM_MEMBERS_BREAKDOWN_LOAD_SUCCESS,
  TEAM_MEMBERS_BREAKDOWN_LOAD_FAILS,
  TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST,
  TEAM_MEMBERS_DOWNLOAD_REPORT_SUCCESS,
  TEAM_MEMBERS_DOWNLOAD_REPORT_FAIL,
} from './teamMembers.types';

export const teamMembersLoadRequest = options => ({
  type: TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST,
  payload: options,
});

export const teamMembersLoadSuccess = breakdown => ({
  type: TEAM_MEMBERS_BREAKDOWN_LOAD_SUCCESS,
  payload: breakdown,
});

export const teamMembersLoadFail = error => ({
  type: TEAM_MEMBERS_BREAKDOWN_LOAD_FAILS,
  payload: error,
});

export const teamMembersDownloadReportRequest = options => ({
  type: TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST,
  payload: options,
});
export const teamMembersDownloadReportSuccess = () => ({
  type: TEAM_MEMBERS_DOWNLOAD_REPORT_SUCCESS,
});
export const teamMembersDownloadReportFail = () => ({
  type: TEAM_MEMBERS_DOWNLOAD_REPORT_FAIL,
});
