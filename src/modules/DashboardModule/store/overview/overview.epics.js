import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, debounce, withLatestFrom, tap, takeUntil } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';

import { OVERVIEW_LOAD_REQUEST, OVERVIEW_DOWNLOAD_REPORT_REQUEST } from './overview.types';
import {
  overviewLoadFail,
  overviewLoadSuccess,
  overviewDownloadReportSuccess,
  overviewDownloadReportFail,
} from './overview.actions';
import { getApiCallQuery, getReportFileName } from './overview.selectors';

export const loadOverviewEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(OVERVIEW_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(action => `/enterprise/dashboard/statistics?${getApiCallQuery(action.payload)}`),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => overviewLoadSuccess(response)),
        catchError(response => of(overviewLoadFail(response))),
        takeUntil(action$.ofType(OVERVIEW_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(OVERVIEW_DOWNLOAD_REPORT_REQUEST),
    map(action => [`/enterprise/report/gift_statuses?${getApiCallQuery(action.payload)}`, action]),
    mergeMap(([url, action]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(action.payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => overviewDownloadReportSuccess()),
        catchError(() => [overviewDownloadReportFail()]),
      ),
    ),
  );

export const overviewEpics = [loadOverviewEpic, downloadReportEpic];
