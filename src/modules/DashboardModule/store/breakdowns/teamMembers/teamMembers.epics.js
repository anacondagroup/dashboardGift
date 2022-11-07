import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom, tap, debounce, takeUntil } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';

import { TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST, TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST } from './teamMembers.types';
import {
  teamMembersLoadSuccess,
  teamMembersLoadFail,
  teamMembersDownloadReportSuccess,
  teamMembersDownloadReportFail,
} from './teamMembers.actions';
import { getReportFileName, buildApiUrl, buildReportUrl } from './teamMembers.selectors';

export const loadTeamMembersBreakdownEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST),
    debounce(() => timer(300)),
    map(({ payload }) => buildApiUrl(payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => teamMembersLoadSuccess(response.members)),
        catchError(response => of(teamMembersLoadFail(response))),
        takeUntil(action$.ofType(TEAM_MEMBERS_BREAKDOWN_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(TEAM_MEMBERS_DOWNLOAD_REPORT_REQUEST),
    map(action => [buildReportUrl(action.payload), action]),
    mergeMap(([url, action]) =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName(action.payload)))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => teamMembersDownloadReportSuccess()),
        catchError(() => [teamMembersDownloadReportFail()]),
      ),
    ),
  );

export const teamMembersEpic = [loadTeamMembersBreakdownEpic, downloadReportEpic];
