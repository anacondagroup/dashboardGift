import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom, tap, debounce, takeUntil } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';

import { CONTACTS_BREAKDOWN_LOAD_REQUEST, CONTACTS_DOWNLOAD_REPORT_REQUEST } from './contacts.types';
import {
  contactsLoadSuccess,
  contactsLoadFail,
  contactsDownloadReportSuccess,
  contactsDownloadReportFail,
} from './contacts.actions';
import { getReportFileName, buildApiUrl, buildReportUrl } from './contacts.selectors';

export const loadContactsBreakdownEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(CONTACTS_BREAKDOWN_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(action => buildApiUrl(action.payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => contactsLoadSuccess(response.recipients)),
        catchError(response => of(contactsLoadFail(response))),
        takeUntil(action$.ofType(CONTACTS_BREAKDOWN_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(CONTACTS_DOWNLOAD_REPORT_REQUEST),
    map(action => [buildReportUrl(action.payload), action]),
    mergeMap(([url, action]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(action.payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => contactsDownloadReportSuccess()),
        catchError(() => contactsDownloadReportFail()),
      ),
    ),
  );

export const contactsEpic = [loadContactsBreakdownEpic, downloadReportEpic];
