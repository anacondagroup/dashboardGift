import qs from 'query-string';
import { Epic } from 'redux-observable';
import { catchError, flatMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { IListResponse, IResponse } from '@alycecom/services';

import { IInventoryDeposits } from '../../types';
import { getTeamsFilter } from '../customerOrg';
import { getDateRange } from '../ui/overviewFilters/overviewFilters.selectors';

import {
  acceptedInvitesFailure,
  acceptedInvitesRequest,
  acceptedInvitesSuccess,
  acceptedTeamInventoriesFailure,
  acceptedTeamInventoriesRequest,
  acceptedTeamInventoriesSuccess,
  emailReportFailure,
  emailReportRequest,
  emailReportSuccess,
  sentInvitesFailure,
  sentInvitesRequest,
  sentInvitesSuccess,
  setFilters,
} from './breakdowns.actions';
import { getAcceptedFilters, getSentFilters } from './breakdowns.selectors';
import { IGroupedResources } from './breakdowns.types';

const createDateFilterParams = ({ from, to }: { from?: string; to?: string }) => {
  const params: { [key: string]: string | string[] | number | number[] | boolean } = {};
  if (from) {
    params['filters[dateRange][from]'] = from;
    params['filters[dateRange][fromIncluded]'] = true;
  }
  if (to) {
    params['filters[dateRange][to]'] = to;
    params['filters[dateRange][toIncluded]'] = true;
  }
  return params;
};

export const sentInvitesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(sentInvitesRequest),
    mergeMap(() => {
      const filters = createDateFilterParams(getSentFilters(state$.value));
      const { teamIds, groupIds } = getTeamsFilter(state$.value);
      filters['teamIds[]'] = teamIds;
      filters['groupIds[]'] = groupIds;
      filters.resourcesScope = 'spent';
      return apiService.get(`/api/v1/reporting/resources/team-group-grouped?${qs.stringify(filters)}`, {}, true).pipe(
        flatMap((response: IResponse<IGroupedResources>) => [sentInvitesSuccess(response.data)]),
        takeUntil(action$.ofType(sentInvitesRequest)),
        catchError(errorHandler({ callbacks: sentInvitesFailure })),
      );
    }),
  );

export const acceptedInvitesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(acceptedInvitesRequest),
    mergeMap(() => {
      const filters = createDateFilterParams(getAcceptedFilters(state$.value));
      const { teamIds, groupIds } = getTeamsFilter(state$.value);
      filters['teamIds[]'] = teamIds;
      filters['groupIds[]'] = groupIds;
      filters.resourcesScope = 'accepted';
      return apiService.get(`/api/v1/reporting/resources/team-group-grouped?${qs.stringify(filters)}`, {}, true).pipe(
        flatMap((response: IResponse<IGroupedResources>) => [acceptedInvitesSuccess(response.data)]),
        takeUntil(action$.ofType(acceptedInvitesRequest)),
        catchError(errorHandler({ callbacks: acceptedInvitesFailure })),
      );
    }),
  );

export const changeFiltersEpic: Epic = action$ =>
  action$.pipe(
    ofType(setFilters),
    mergeMap(() => [sentInvitesRequest(), acceptedInvitesRequest()]),
  );

export const acceptedTeamInventoriesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(acceptedTeamInventoriesRequest),
    mergeMap(action => {
      const filters = createDateFilterParams(getAcceptedFilters(state$.value));
      const { teamId, groupId } = action.payload;
      filters['teamIds[]'] = teamId;
      filters['groupIds[]'] = groupId;

      return apiService
        .get(`/api/v1/reporting/resources/inventory-grouped-deposits?${qs.stringify(filters)}`, {}, true)
        .pipe(
          flatMap((response: IListResponse<IInventoryDeposits>) => [
            acceptedTeamInventoriesSuccess({ groupId, teamId, inventories: response.data }),
          ]),
          takeUntil(action$.ofType(acceptedTeamInventoriesRequest)),
          catchError(errorHandler({ callbacks: () => acceptedTeamInventoriesFailure({ groupId, teamId }) })),
        );
    }),
  );

export const emailReportEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(emailReportRequest),
    mergeMap(action => {
      const steps = { sendToEmail: action.payload };
      const { teamIds, groupIds } = getTeamsFilter(state$.value);
      const dateRange = getDateRange(state$.value);
      const filters = {
        teamIds,
        groupIds,
        ...(dateRange.from && dateRange.to
          ? {
              spentPeriod: {
                from: `${dateRange.from}T00:00:00Z`,
                fromIncluded: true,
                to: `${dateRange.to}T23:59:59Z`,
                toIncluded: true,
              },
            }
          : {}),
        ...(dateRange.from && dateRange.to
          ? {
              acceptedPeriod: {
                from: `${dateRange.from}T00:00:00Z`,
                fromIncluded: true,
                to: `${dateRange.to}T23:59:59Z`,
                toIncluded: true,
              },
            }
          : {}),
      };
      return apiService
        .post('/api/v1/reporting/resources/report-request/billing-insights', { body: { steps, filters } }, true)
        .pipe(
          flatMap(() => [
            emailReportSuccess(),
            showGlobalMessage({ text: 'Your request successfully queued', type: 'success' }),
          ]),
          takeUntil(action$.ofType(emailReportRequest)),
          catchError(errorHandler({ callbacks: emailReportFailure, showErrorsAsGlobal: true })),
        );
    }),
  );

export default [sentInvitesEpic, acceptedInvitesEpic, acceptedTeamInventoriesEpic, emailReportEpic, changeFiltersEpic];
