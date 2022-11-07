import { Epic } from 'redux-observable';
import { catchError, concatMap, distinctUntilChanged, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { handlers } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import qs from 'query-string';

import { getActivateModuleParams } from '../../../activate.selectors';
import { pollContactsUploadingFileFinish } from '../uploadRequest';
import { ActivateModes } from '../../../../routePaths';

import {
  loadContactsFail,
  loadContactsRequest,
  loadContactsSuccess,
  resetStatusMetaData,
  setContactsFilters,
} from './contacts.actions';
import { IContactsResponse } from './contacts.types';
import { getContactsFilters, getContactsPagination, getMetaData } from './contacts.selectors';

const contactsQueryParamsSideEffectEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(setContactsFilters),
    withLatestFrom(state$),
    map(([, state]) => {
      const { campaignId } = getActivateModuleParams(state);
      return loadContactsRequest({ campaignId });
    }),
  );

const loadContactsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadContactsRequest),
    withLatestFrom(state$),
    map(([action, state]) => {
      const {
        payload: { campaignId },
      } = action;
      const { search, sortDirection, sortField } = getContactsFilters(state);
      const { limit, offset } = getContactsPagination(state);
      const meta = getMetaData(state);

      const params = {
        limit,
        search,
        offset,
        sort: `${sortField}:${sortDirection.toLowerCase()}`,
      };
      const queryString = qs.stringify(params);
      return {
        campaignId,
        queryString,
        meta,
      };
    }),
    distinctUntilChanged((oldEvent, newEvent) => {
      if (oldEvent.campaignId === newEvent.campaignId && oldEvent.queryString === newEvent.queryString) {
        return !!newEvent.meta;
      }
      return false;
    }),
    concatMap(({ campaignId, queryString }) =>
      apiService.get(`/api/v1/campaigns/activate/campaigns/${campaignId}/contacts?${queryString}`, null, true).pipe(
        mergeMap((response: IContactsResponse) => [loadContactsSuccess(response)]),
        catchError(apiService.handleError(handlers.handleAnyError(loadContactsFail))),
      ),
    ),
  );

const syncContactsListOnPollEndedSideEffectEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(pollContactsUploadingFileFinish),
    withLatestFrom(state$),
    filter(([, state]) => {
      const { mode } = getActivateModuleParams(state);
      return mode === ActivateModes.Editor;
    }),
    mergeMap(([, state]) => {
      const { campaignId } = getActivateModuleParams(state);
      return [resetStatusMetaData(), loadContactsRequest({ campaignId, reset: true })];
    }),
  );

export const contactsEpics = [
  loadContactsEpic,
  contactsQueryParamsSideEffectEpic,
  syncContactsListOnPollEndedSideEffectEpic,
];
