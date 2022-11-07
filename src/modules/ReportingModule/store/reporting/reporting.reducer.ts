import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { IReportInfo } from './reporting.types';
import {
  fetchReports,
  createReport,
  deleteReport,
  editReport,
  resetEditStatus,
  resetCreateStatus,
  downloadReport,
} from './reporting.actions';

export interface IReportingState {
  reports: IReportInfo[];
  listReportsStatus: StateStatus;
  editReportsStatus: StateStatus;
  deleteReportsStatus: StateStatus;
  createReportsStatus: StateStatus;
  downloadReportStatus: StateStatus;
}

export const initialReportingState: IReportingState = {
  listReportsStatus: StateStatus.Idle,
  editReportsStatus: StateStatus.Idle,
  deleteReportsStatus: StateStatus.Idle,
  createReportsStatus: StateStatus.Idle,
  downloadReportStatus: StateStatus.Idle,
  reports: [],
};

export const reporting = createReducer<IReportingState>({}, initialReportingState);

reporting.on(fetchReports.pending, state => ({
  ...state,
  listReportsStatus: StateStatus.Pending,
}));

reporting.on(fetchReports.fulfilled, (state, payload) => {
  const records = Object.keys(payload.reports).map((key: string) => payload.reports[key]);
  return {
    ...state,
    reports: records,
    listReportsStatus: StateStatus.Fulfilled,
  };
});

reporting.on(fetchReports.rejected, state => ({
  ...state,
  listReportsStatus: StateStatus.Rejected,
}));

reporting.on(editReport.pending, state => ({
  ...state,
  editReportsStatus: StateStatus.Pending,
}));

reporting.on(editReport.fulfilled, (state, payload) => ({
  ...state,
  reports: state.reports.map(item => {
    if (item.id === payload.id) {
      return payload;
    }
    return item;
  }),
  editReportsStatus: StateStatus.Fulfilled,
}));

reporting.on(editReport.rejected, state => ({
  ...state,
  editReportsStatus: StateStatus.Rejected,
}));

reporting.on(deleteReport.pending, state => ({
  ...state,
  deleteReportsStatus: StateStatus.Pending,
}));

reporting.on(deleteReport.fulfilled, (state, payload) => ({
  ...state,
  reports: state.reports.filter(item => item.id !== payload),
  deleteReportsStatus: StateStatus.Fulfilled,
}));

reporting.on(deleteReport.rejected, state => ({
  ...state,
  deleteReportsStatus: StateStatus.Rejected,
}));

reporting.on(createReport.pending, state => ({
  ...state,
  createReportsStatus: StateStatus.Pending,
}));

reporting.on(createReport.fulfilled, (state, payload) => ({
  ...state,
  reports: [payload, ...state.reports],
  createReportsStatus: StateStatus.Fulfilled,
}));

reporting.on(createReport.rejected, state => ({
  ...state,
  createReportsStatus: StateStatus.Rejected,
}));

reporting.on(resetEditStatus, state => ({
  ...state,
  editReportsStatus: StateStatus.Idle,
}));

reporting.on(resetCreateStatus, state => ({
  ...state,
  createReportsStatus: StateStatus.Idle,
}));

reporting.on(downloadReport.pending, state => ({
  ...state,
  downloadReportStatus: StateStatus.Pending,
}));

reporting.on(downloadReport.fulfilled, state => ({
  ...state,
  downloadReportStatus: StateStatus.Fulfilled,
}));

reporting.on(downloadReport.rejected, state => ({
  ...state,
  downloadReportStatus: StateStatus.Rejected,
}));
