import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import {
  IListResponse,
  IResponse,
  handleError,
  handlers,
  TTransaction,
  TTeamInfo,
  TGroupInfo,
} from '@alycecom/services';
import qs from 'query-string';

import { IAccountResources } from '../../types';
import { acceptedInvitesRequest, sentInvitesRequest } from '../breakdowns';

import {
  loadLastInvoiceFail,
  loadLastInvoiceRequest,
  loadLastInvoiceSuccess,
  loadResourcesFail,
  loadResourcesRequest,
  loadResourcesSuccess,
  loadStatsFail,
  loadStatsRequest,
  loadStatsSuccess,
  orgGroupsFailure,
  orgGroupsRequest,
  orgGroupsSuccess,
  orgTeamsFailure,
  orgTeamsRequest,
  orgTeamsSuccess,
  setTeamsFilter,
} from './customerOrg.actions';
import { ICustomerStats } from './customerOrg.types';
import { getTeamsFilter } from './customerOrg.selectors';

export const orgTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(orgTeamsRequest),
    mergeMap(() =>
      apiService.get('/api/v1/hierarchy/teams', {}, true).pipe(
        map((response: IListResponse<TTeamInfo>) => orgTeamsSuccess(response.data)),
        takeUntil(action$.ofType(orgTeamsRequest)),
        catchError(errorHandler({ callbacks: orgTeamsFailure })),
      ),
    ),
  );

export const orgGroupsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(orgGroupsRequest),
    mergeMap(() =>
      apiService.get('/api/v1/groups', {}, true).pipe(
        map((response: IListResponse<TGroupInfo>) => orgGroupsSuccess(response.data)),
        takeUntil(action$.ofType(orgGroupsRequest)),
        catchError(errorHandler({ callbacks: orgGroupsFailure })),
      ),
    ),
  );

export const changeTeamsFilterEpic: Epic = action$ =>
  action$.pipe(
    ofType(setTeamsFilter),
    switchMap(() => [sentInvitesRequest(), acceptedInvitesRequest(), loadResourcesRequest()]),
  );

export const loadStatsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadStatsRequest),
    switchMap(() =>
      apiService.get('/api/v1/statistic', {}, true).pipe(
        map((response: ICustomerStats) => loadStatsSuccess(response)),
        catchError(errorHandler({ callbacks: loadStatsFail })),
      ),
    ),
  );

export const loadResourcesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadResourcesRequest),
    switchMap(() => {
      const { groupIds } = getTeamsFilter(state$.value);
      const filters = {
        'groupIds[]': groupIds,
      };
      return apiService.get(`/api/v1/resources?${qs.stringify(filters)}`, {}, true).pipe(
        map((response: IAccountResources) => loadResourcesSuccess(response)),
        catchError(errorHandler({ callbacks: loadResourcesFail })),
      );
    }),
  );

const loadLastInvoiceEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadLastInvoiceRequest),
    switchMap(() =>
      apiService.get('/api/v1/reporting/resources/deposits/operations/latest-invoice', {}, true).pipe(
        map((response: IResponse<TTransaction>) => loadLastInvoiceSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(loadLastInvoiceFail))),
      ),
    ),
  );

export default [
  orgTeamsEpic,
  orgGroupsEpic,
  changeTeamsFilterEpic,
  loadStatsEpic,
  loadResourcesEpic,
  loadLastInvoiceEpic,
];
