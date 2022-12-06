import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mapTo, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { IListResponse } from '@alycecom/services';
import qs from 'query-string';

import { IOperation } from '../../types';

import {
  loadOperationsFail,
  loadOperationsRequest,
  loadOperationsSuccess,
  loadTypesFail,
  loadTypesRequest,
  loadTypesSuccess,
  setCurrentPage,
  setDateRange,
  setSelectedTypes,
} from './operations.actions';
import { IOperationType, IPagination } from './operations.types';
import { getQueryParamsFromState } from './operations.helpers';

export const loadOperationsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadOperationsRequest),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
      const { accountId, params } = getQueryParamsFromState({ state });
      return apiService
        .get(`/api/v1/reporting/resources/deposits/${accountId}/operations?${qs.stringify(params)}`, {}, true)
        .pipe(
          map((response: { data: IOperation[]; pagination: IPagination }) => loadOperationsSuccess(response)),
          catchError(errorHandler({ callbacks: loadOperationsFail })),
        );
    }),
  );

export const setDateRangeEpic: Epic = action$ => action$.pipe(ofType(setDateRange), mapTo(loadOperationsRequest()));

export const setSelectedTypesEpic: Epic = action$ =>
  action$.pipe(ofType(setSelectedTypes), mapTo(loadOperationsRequest()));

export const loadTypesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadTypesRequest),
    switchMap(() =>
      apiService.get('/api/v1/reporting/resources/deposits/operations/category-types', {}, true).pipe(
        map((response: IListResponse<IOperationType>) => loadTypesSuccess(response.data)),
        catchError(errorHandler({ callbacks: loadTypesFail })),
      ),
    ),
  );

export const setPageEpic: Epic = action$ => action$.pipe(ofType(setCurrentPage), mapTo(loadOperationsRequest()));

export default [loadOperationsEpic, setDateRangeEpic, setSelectedTypesEpic, loadTypesEpic, setPageEpic];
