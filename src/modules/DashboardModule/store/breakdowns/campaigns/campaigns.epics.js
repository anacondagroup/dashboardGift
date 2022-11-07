import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom, tap, debounce, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

import { CAMPAIGNS_BREAKDOWN_LOAD_REQUEST, CAMPAIGNS_DOWNLOAD_REPORT_REQUEST } from './campaigns.types';
import {
  campaignsLoadSuccess,
  campaignsLoadFail,
  campaignsDownloadReportSuccess,
  campaignsDownloadReportFail,
} from './campaigns.actions';
import { buildReportUrl, getReportFileName, buildApiUrl } from './campaigns.selectors';

export const loadCampaignsBreakdownEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(CAMPAIGNS_BREAKDOWN_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(({ payload }) => buildApiUrl(payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => campaignsLoadSuccess(response.campaigns)),
        catchError(errorHandler({ callbacks: campaignsLoadFail })),
        takeUntil(action$.ofType(CAMPAIGNS_BREAKDOWN_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(CAMPAIGNS_DOWNLOAD_REPORT_REQUEST),
    map(({ payload }) => [buildReportUrl(payload), payload]),
    mergeMap(([url, payload]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => campaignsDownloadReportSuccess()),
        catchError(errorHandler({ callbacks: campaignsDownloadReportFail })),
      ),
    ),
  );

export const campaignsEpic = [loadCampaignsBreakdownEpic, downloadReportEpic];
