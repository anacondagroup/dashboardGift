import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { pickNotEmpty } from '@alycecom/utils';

import qs from 'querystring';

import { downloadTemplateSuccess } from '../../../../../store/bulkCreateContacts/import/import.actions';

import { SWAG_BATCHES_BREAKDOWN_DATA_REQUEST, SWAG_BATCHES_DOWNLOAD_REPORT_LINK } from './swagBatches.types';
import { swagBatchesBreakdownDataFail, swagBatchesBreakdownDataSuccess } from './swagBatches.actions';
import { getSwagBatchesReportLink } from './swagBatches.selectors';

export const loadSwagBatchesBreakdownDataRequest = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler } },
) =>
  action$.pipe(
    ofType(SWAG_BATCHES_BREAKDOWN_DATA_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/breakdown/code-batches?${qs.stringify(pickNotEmpty(payload))}`).pipe(
        map(resp => swagBatchesBreakdownDataSuccess(resp)),
        catchError(error =>
          errorHandler({ callbacks: swagBatchesBreakdownDataFail })({
            ...error,
            message: 'Sorry! Batched not loaded.',
          }),
        ),
      ),
    ),
  );

export const downloadBatchReportEpic = (
  action$,
  state$,
  { apiService, downloadFile, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_BATCHES_DOWNLOAD_REPORT_LINK),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService.getFile(getSwagBatchesReportLink(state)).pipe(
        withLatestFrom(state$.pipe(map(() => action.payload))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(downloadTemplateSuccess),
        catchError(() => of(showGlobalMessage({ type: 'error', text: 'Error. Please retry.' }))),
      ),
    ),
  );

export const swagBatchesBreakdownEpics = [loadSwagBatchesBreakdownDataRequest, downloadBatchReportEpic];
