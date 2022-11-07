import {
  CONTACTS_BREAKDOWN_LOAD_REQUEST,
  CONTACTS_BREAKDOWN_LOAD_SUCCESS,
  CONTACTS_BREAKDOWN_LOAD_FAILS,
  CONTACTS_DOWNLOAD_REPORT_REQUEST,
  CONTACTS_DOWNLOAD_REPORT_SUCCESS,
  CONTACTS_DOWNLOAD_REPORT_FAIL,
} from './contacts.types';

export const contactsLoadRequest = options => ({
  type: CONTACTS_BREAKDOWN_LOAD_REQUEST,
  payload: options,
});

export const contactsLoadSuccess = breakdown => ({
  type: CONTACTS_BREAKDOWN_LOAD_SUCCESS,
  payload: breakdown,
});

export const contactsLoadFail = error => ({
  type: CONTACTS_BREAKDOWN_LOAD_FAILS,
  payload: error,
});

export const contactsDownloadReportRequest = options => ({
  type: CONTACTS_DOWNLOAD_REPORT_REQUEST,
  payload: options,
});

export const contactsDownloadReportSuccess = () => ({
  type: CONTACTS_DOWNLOAD_REPORT_SUCCESS,
});

export const contactsDownloadReportFail = () => ({
  type: CONTACTS_DOWNLOAD_REPORT_FAIL,
});
