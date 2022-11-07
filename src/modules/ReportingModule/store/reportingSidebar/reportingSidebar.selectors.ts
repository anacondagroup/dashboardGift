import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';
import { ReportingSidebarStep } from '../reporting/reporting.constants';

const pathToReportsState = (state: IRootState) => state.reportingSidebar;

export const getSidebarStep = pipe(pathToReportsState, state => state.sidebarStep);
export const getPrevSidebarStep = pipe(pathToReportsState, state => state.prevSidebarStep);

export const getHasBackButton = pipe(
  pathToReportsState,
  state =>
    state.sidebarStep === ReportingSidebarStep.createGiftingTrendsReport ||
    state.sidebarStep === ReportingSidebarStep.createNewTeamUsageReport ||
    state.sidebarStep === ReportingSidebarStep.createPerformanceSummaryReport ||
    state.sidebarStep === ReportingSidebarStep.editGiftingTrendsReport ||
    state.sidebarStep === ReportingSidebarStep.editTeamUsageReport ||
    state.sidebarStep === ReportingSidebarStep.editPerformanceReport,
);

export const getIsSidebarOpen = pipe(pathToReportsState, state => state.sidebarStep !== null);
export const getReportIdToEdit = pipe(pathToReportsState, state => state.reportToEdit);
export const getIsFormDirty = pipe(pathToReportsState, state => state.isFormDirty);
