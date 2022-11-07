import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'redux';
import { handlers, handleError, MessageType } from '@alycecom/services';
import qs from 'query-string';

import { getCachedBillingGroup } from '../editBillingGroups/editBillingGroups.selectors';
import { TCreateBillingGroupForm } from '../editBillingGroups/editBillingGroups.types';
import { clearCachedBillingGroup } from '../editBillingGroups/editBillingGroups.actions';

import {
  IBillingGroupsPayload,
  ITeamsPayload,
  IGroupsDetailsComplete,
  ISearchGroupResultsPayload,
} from './billingGroups.types';
import { getPagination, getSearchGroupTerm, getSearchGroupsResults, getIsSearching } from './billingGroups.selectors';
import {
  getGroupsListRequest,
  getGroupsListSuccess,
  getGroupsListFail,
  resetBillingGroupsResult,
  setBillingGroupsCurrentPage,
  getTeamsListRequest,
  getTeamsListSuccess,
  getTeamsListFail,
  setSearchGroupTerm,
  getSearchGroupsListRequest,
  getSearchGroupsListSuccess,
  getSearchGroupsListFail,
} from './billingGroups.actions';
import { buildGroupsUrl, buildSearchUrl } from './billingGroups.helpers';

const updateCachedDataInResponse = (
  cachedData: TCreateBillingGroupForm | null,
  response: IBillingGroupsPayload,
): IBillingGroupsPayload => ({
  ...response,
  data: response.data.map(group =>
    group.groupId === cachedData?.groupId
      ? ({
          ...group,
          groupName: cachedData?.name,
          firstName: cachedData?.primaryBillingContact?.firstName,
          lastName: cachedData?.primaryBillingContact?.lastName,
          email: cachedData?.primaryBillingContact?.email,
          emailsCc: cachedData?.sendInvoicesTo?.map(email => email.email),
          poNumber: cachedData?.poNumber,
        } as IGroupsDetailsComplete)
      : group,
  ),
});

export const getBillingGroupsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(getGroupsListRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const pagination = getPagination(state);
      const groupIds = getSearchGroupsResults(state);
      const urlString = buildGroupsUrl(pagination, payload.isSearching, groupIds);
      return apiService.get(urlString, {}, true).pipe(
        mergeMap((response: IBillingGroupsPayload) => {
          const cachedData = getCachedBillingGroup(state);
          const updatedResponse = updateCachedDataInResponse(cachedData, response);
          return [getGroupsListSuccess(updatedResponse), clearCachedBillingGroup()];
        }),
        catchError(
          handleError(
            handlers.handleAnyError(
              getGroupsListFail,
              showGlobalMessage({ text: 'Internal server error: Try refreshing the page', type: MessageType.Error }),
            ),
          ),
        ),
      );
    }),
  );

export const getBillingTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(getTeamsListRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/api/v1/hierarchy/teams?${qs.stringify({ 'groupIds[]': payload.groupId })}`, null, true).pipe(
        mergeMap((response: ITeamsPayload) => [getTeamsListSuccess({ ...response, groupIds: payload.groupId })]),
        catchError(
          handleError(
            handlers.handleAnyError(getTeamsListFail({ groupId: payload.groupId })),
            handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
          ),
        ),
      ),
    ),
  );

export const setBillingGroupsPaginationEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(setBillingGroupsCurrentPage),
    switchMap(() => {
      const actions: Action[] = [];
      const isSearching = getIsSearching(state$.value);
      if (isSearching) {
        actions.push(getSearchGroupsListRequest());
      } else {
        actions.push(getGroupsListRequest({ isSearching: false }));
      }
      return actions;
    }),
  );

export const setSearchGroupTermEpic: Epic = action$ =>
  action$.pipe(
    ofType(setSearchGroupTerm),
    switchMap(() => [getSearchGroupsListRequest()]),
  );

export const getSearchGroupsListEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(getSearchGroupsListRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const term = getSearchGroupTerm(state);
      if (term) {
        const pagination = getPagination(state);
        return apiService.get(buildSearchUrl(pagination, term), null, true).pipe(
          mergeMap((response: ISearchGroupResultsPayload) => {
            const actions: Action[] = [getSearchGroupsListSuccess(response)];
            if (response.data.length > 0) {
              actions.push(getGroupsListRequest({ isSearching: true }));
            } else {
              actions.push(resetBillingGroupsResult());
            }
            return actions;
          }),
          catchError(
            handleError(
              handlers.handleAnyError(getSearchGroupsListFail),
              handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
            ),
          ),
        );
      }
      return [getGroupsListRequest({ isSearching: false })];
    }),
  );

export default [
  getBillingGroupsEpic,
  setBillingGroupsPaginationEpic,
  getBillingTeamsEpic,
  setSearchGroupTermEpic,
  getSearchGroupsListEpic,
];
