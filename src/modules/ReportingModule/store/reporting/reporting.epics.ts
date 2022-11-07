import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { setSidebarStep } from '../reportingSidebar/reportingSidebar.actions';

import { ICreateResponse, IListResponse } from './reporting.types';
import { deleteReport, editReport, fetchReports, createReport, downloadReport } from './reporting.actions';

export const getReportEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchReports.pending),
    switchMap(() =>
      apiGateway.get('/reporting/looker/scheduled-plans', {}, true).pipe(
        mergeMap((response: IListResponse) => [fetchReports.fulfilled(response.data)]),
        catchError(handleError(handlers.handleAnyError(fetchReports.rejected))),
      ),
    ),
  );

export const createReportEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createReport.pending),
    switchMap(({ payload }) =>
      apiGateway.post('/reporting/looker/scheduled-plans', { body: payload }, true).pipe(
        mergeMap((response: ICreateResponse) => [
          createReport.fulfilled(response.data),
          showGlobalMessage({ type: 'success', text: 'Report has been created' }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              createReport.rejected,
              showGlobalMessage({
                type: MessageType.Error,
                text: "Ooops, error! Report hasn't been created, please retry",
              }),
            ),
          ),
        ),
      ),
    ),
  );

export const editReportEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(editReport.pending),
    switchMap(({ payload }) =>
      apiGateway.patch(`/reporting/looker/scheduled-plans/${payload.id}`, { body: payload }, true).pipe(
        switchMap((response: ICreateResponse) => [
          editReport.fulfilled(response.data),
          showGlobalMessage({ type: 'success', text: 'Report has been edited' }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              editReport.rejected,
              showGlobalMessage({
                type: MessageType.Error,
                text: 'Ooops, error! There has been an error updating the reports',
              }),
            ),
          ),
        ),
      ),
    ),
  );

export const downloadReportEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(downloadReport.pending),
    switchMap(({ payload }) =>
      apiGateway.post('/reporting/looker/scheduled-plans', { body: payload }, true).pipe(
        switchMap(() => [
          downloadReport.fulfilled(),
          setSidebarStep({ step: null }),
          showGlobalMessage({ type: 'success', text: 'Success! Your report will be sent to your email. ' }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              downloadReport.rejected,
              showGlobalMessage({
                type: MessageType.Error,
                text: "Ooops, error! Report hasn't been created, please retry",
              }),
            ),
          ),
        ),
      ),
    ),
  );

export const deleteReportEpic: Epic = (action$, state$, { apiGateway, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(deleteReport.pending),
    switchMap(({ payload }) =>
      apiGateway.delete(`/reporting/looker/scheduled-plans/${payload}`, null, true).pipe(
        mergeMap(() => [
          deleteReport.fulfilled(payload),
          showGlobalMessage({ type: 'success', text: 'Report has been deleted' }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              deleteReport.rejected,
              showGlobalMessage({
                type: MessageType.Error,
                text: "Ooops, error! Report hasn't been deleted, please retry",
              }),
            ),
          ),
        ),
      ),
    ),
  );

export const createReportEpics = [
  getReportEpic,
  editReportEpic,
  createReportEpic,
  deleteReportEpic,
  downloadReportEpic,
];
