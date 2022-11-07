import { equals, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { createSelector, OutputSelector } from 'reselect';

import { IRootState } from '../../../../store/root.types';
import { getReportIdToEdit } from '../reportingSidebar/reportingSidebar.selectors';

import { GiftingInsights, GiftingInsightsAPICall } from './reporting.constants';
import { IReportInfo } from './reporting.types';

const pathToReportsState = (state: IRootState) => state.reporting;

export const getCreateStatus = pipe(pathToReportsState, state => state.createReportsStatus);

export const getListStatus = pipe(pathToReportsState, state => state.listReportsStatus);

export const getEditStatus = pipe(pathToReportsState, state => state.editReportsStatus);

export const getListStatusFulfilled = pipe(getListStatus, equals(StateStatus.Fulfilled));

export const getListStatusPending = pipe(getListStatus, equals(StateStatus.Pending));

export const getEditStatusFulfilled = pipe(getEditStatus, equals(StateStatus.Fulfilled));

export const getEditStatusPending = pipe(getEditStatus, equals(StateStatus.Pending));

export const getCreateStatusFulfilled = pipe(getCreateStatus, equals(StateStatus.Fulfilled));

export const getCreateStatusPending = pipe(getCreateStatus, equals(StateStatus.Pending));

export const getDownloadStatus = pipe(pathToReportsState, state => state.downloadReportStatus);

export const getDownloadReportPending = pipe(getDownloadStatus, equals(StateStatus.Pending));

export const getReports = pipe(pathToReportsState, state => state.reports);

export const getReportToEdit = createSelector(getReports, getReportIdToEdit, (reports, reportToEdit) =>
  reports.find(item => item.id === reportToEdit),
);

export const getReportsByReportName = (
  stepName: GiftingInsights,
): OutputSelector<IRootState, IReportInfo[], (res: IReportInfo[]) => IReportInfo[]> =>
  createSelector(getReports, reports => {
    const formattedType = GiftingInsightsAPICall[stepName];
    const reportItems = Object.values(reports);
    return reportItems?.filter(item => item.name === formattedType);
  });
