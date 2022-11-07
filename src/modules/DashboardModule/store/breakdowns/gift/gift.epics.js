import { ofType } from 'redux-observable';
import { catchError, debounce, map, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { of, timer } from 'rxjs';

import { getApiCallQuery, urlBuilder } from '../../../../../helpers/url.helpers';

import {
  GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST,
  GIFT_BREAKDOWN_LOAD_REQUEST,
  GIFT_BREAKDOWN_TABLE_LOAD_REQUEST,
  GIFT_DOWNLOAD_RECEIPTS_REQUEST,
  GIFT_DOWNLOAD_REPORT_REQUEST,
} from './gift.types';
import {
  giftBreakdownDownloadReportFail,
  giftBreakdownDownloadReportSuccess,
  giftBreakdownLoadFail,
  giftBreakdownSuccess,
  giftDownloadReceiptsFail,
  giftDownloadReceiptsSuccess,
  giftDownloadReportFail,
  giftDownloadReportSuccess,
  giftLoadFail,
  giftLoadSuccess,
} from './gift.actions';
import { getReportFileName } from './gift.selectors';

export const breakdownAPIUrl = options => `/enterprise/dashboard/breakdown/gifts?${urlBuilder(options)}`;
export const breakdownReportUrl = options => `/enterprise/report/gift_breakdown?${urlBuilder(options)}`;

export const buildApiUrl = options => `/enterprise/dashboard/breakdown/gifts?${getApiCallQuery(options)}`;
export const buildReportUrl = options => `/enterprise/report/gift_breakdown?${getApiCallQuery(options)}`;
export const buildReceiptUrl = options => `/enterprise/report/gift_receipts?${getApiCallQuery(options)}`;

export const loadBreakdownEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(GIFT_BREAKDOWN_TABLE_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(action => breakdownAPIUrl(action.payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => giftBreakdownSuccess(response)),
        catchError(response => of(giftBreakdownLoadFail(response))),
        takeUntil(action$.ofType(GIFT_BREAKDOWN_TABLE_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadGiftBreakdownReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(GIFT_BREAKDOWN_DOWNLOAD_REPORT_REQUEST),
    map(action => [breakdownReportUrl(action.payload), action]),
    mergeMap(([url, action]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(action.payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => giftBreakdownDownloadReportSuccess()),
        catchError(() => [giftBreakdownDownloadReportFail()]),
      ),
    ),
  );

export const loadGiftBreakdownEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(GIFT_BREAKDOWN_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(action => buildApiUrl(action.payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => giftLoadSuccess(response)),
        catchError(response => of(giftLoadFail(response))),
        takeUntil(action$.ofType(GIFT_BREAKDOWN_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(GIFT_DOWNLOAD_REPORT_REQUEST),
    map(action => [buildReportUrl(action.payload), action]),
    mergeMap(([url, action]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(action.payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => giftDownloadReportSuccess()),
        catchError(() => [giftDownloadReportFail()]),
      ),
    ),
  );

export const downloadReceiptsEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(GIFT_DOWNLOAD_RECEIPTS_REQUEST),
    map(action => [buildReceiptUrl(action.payload), action]),
    mergeMap(([url]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(() => 'Gifts receipt'))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => giftDownloadReceiptsSuccess()),
        catchError(() => [giftDownloadReceiptsFail()]),
      ),
    ),
  );

export const giftEpic = [
  loadBreakdownEpic,
  loadGiftBreakdownEpic,
  downloadGiftBreakdownReportEpic,
  downloadReportEpic,
  downloadReceiptsEpic,
];
