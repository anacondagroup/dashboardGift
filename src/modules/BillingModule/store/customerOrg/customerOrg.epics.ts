import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, flatMap, mapTo, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { IListResponse, IResponse, handleError, handlers } from '@alycecom/services';
import qs from 'query-string';

import { IAccountResources, IGroupInfo, IOperation, ITeamInfo } from '../../types';
import { acceptedInvitesRequest, sentInvitesRequest } from '../breakdowns';
import { loadOperationsRequest } from '../operations';

import {
  customerOrgFailure,
  customerOrgRequest,
  customerOrgSuccess,
  loadHierarchyFail,
  loadHierarchyRequest,
  loadHierarchySuccess,
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
  setSelectedAccount,
  setTeamsFilter,
} from './customerOrg.actions';
import { ICustomerStats, IOrgHierarchy, IOrgInfo } from './customerOrg.types';
import { getTeamsFilter } from './customerOrg.selectors';

export const customerOrgEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(customerOrgRequest),
    mergeMap(() =>
      apiService.get('/api/v1/organization', {}, true).pipe(
        flatMap((response: IOrgInfo) => [customerOrgSuccess(response)]),
        takeUntil(action$.ofType(customerOrgRequest)),
        catchError(errorHandler({ callbacks: customerOrgFailure })),
      ),
    ),
  );

export const orgTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(orgTeamsRequest),
    mergeMap(() =>
      apiService.get('/api/v1/hierarchy/teams', {}, true).pipe(
        flatMap((response: IListResponse<ITeamInfo>) => [orgTeamsSuccess(response.data)]),
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
        flatMap((response: IListResponse<IGroupInfo>) => [orgGroupsSuccess(response.data)]),
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
        flatMap((response: ICustomerStats) => [loadStatsSuccess(response)]),
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
        flatMap((response: IAccountResources) => [loadResourcesSuccess(response)]),
        catchError(errorHandler({ callbacks: loadResourcesFail })),
      );
    }),
  );

export const loadHierachyEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadHierarchyRequest),
    switchMap(() =>
      apiService.get(`/api/v1/reporting/resources/hierarchy-with-deposits-group-grouped`, {}, true).pipe(
        flatMap((response: IResponse<IOrgHierarchy>) => [loadHierarchySuccess(response.data), loadOperationsRequest()]),
        catchError(errorHandler({ callbacks: loadHierarchyFail })),
      ),
    ),
  );

export const setSelectedAccountEpic: Epic = action$ =>
  action$.pipe(ofType(setSelectedAccount), mapTo(loadOperationsRequest()));

const loadLastInvoiceEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadLastInvoiceRequest),
    switchMap(() =>
      apiService.get('/api/v1/reporting/resources/deposits/operations/latest-invoice', {}, true).pipe(
        flatMap((response: IResponse<IOperation>) => [loadLastInvoiceSuccess(response.data)]),
        catchError(handleError(handlers.handleAnyError(loadLastInvoiceFail))),
      ),
    ),
  );

export default [
  customerOrgEpic,
  orgTeamsEpic,
  orgGroupsEpic,
  changeTeamsFilterEpic,
  loadStatsEpic,
  loadResourcesEpic,
  loadHierachyEpic,
  setSelectedAccountEpic,
  loadLastInvoiceEpic,
];
