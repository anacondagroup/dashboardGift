import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';
import { createAction } from 'redux-act';

import { IReportInfo, ICreateReportRequest, IReportResponse, IDownloadReportRequest } from './reporting.types';

const PREFIX = 'GIFTING_INSIGHTS';

export const fetchReports = createAsyncAction<void, IReportResponse, TErrors>(`${PREFIX}/fetchReports`);

export const createReport = createAsyncAction<ICreateReportRequest, IReportInfo, TErrors>(`${PREFIX}/createReport`);
export const editReport = createAsyncAction<ICreateReportRequest, IReportInfo, TErrors>(`${PREFIX}/editReports`);
export const deleteReport = createAsyncAction<number, number, TErrors>(`${PREFIX}/deleteReports`);
export const resetEditStatus = createAction(`${PREFIX}/RESET_EDIT_STATUS`);
export const resetCreateStatus = createAction(`${PREFIX}/RESET_CREATE_STATUS`);
export const downloadReport = createAsyncAction<IDownloadReportRequest, void, TErrors>(`${PREFIX}/downloadReport`);
