import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom, tap, debounce, takeUntil } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';

import { TEAMS_BREAKDOWN_LOAD_REQUEST, TEAMS_DOWNLOAD_REPORT_REQUEST } from './teams.types';
import { teamsLoadSuccess, teamsLoadFail, teamsDownloadReportSuccess, teamsDownloadReportFail } from './teams.actions';
import { getApiCallQuery, getReportFileName } from './teams.selectors';

export const loadTeamsBreakdownEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(TEAMS_BREAKDOWN_LOAD_REQUEST),
    debounce(() => timer(300)),
    withLatestFrom(state$.pipe(map(state => getApiCallQuery(state.router.location.search)))),
    map(([, search]) => `/enterprise/dashboard/breakdown/teams?${search}`),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(response => teamsLoadSuccess(response.teams)),
        catchError(response => of(teamsLoadFail(response))),
        takeUntil(action$.ofType(TEAMS_BREAKDOWN_LOAD_REQUEST)),
      ),
    ),
  );

export const downloadReportEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(TEAMS_DOWNLOAD_REPORT_REQUEST),
    withLatestFrom(state$.pipe(map(state => getApiCallQuery(state.router.location.search)))),
    map(([, search]) => `/enterprise/report/team_breakdown?${search}`),
    mergeMap(url =>
      apiService.getFile(url).pipe(
        withLatestFrom(state$.pipe(map(getReportFileName))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(() => teamsDownloadReportSuccess()),
        catchError(() => teamsDownloadReportFail()),
      ),
    ),
  );

export const teamsEpic = [loadTeamsBreakdownEpic, downloadReportEpic];
