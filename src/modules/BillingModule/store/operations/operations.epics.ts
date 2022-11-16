import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mapTo, switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { IListResponse, handleError, handlers, MessageType, IResponse } from '@alycecom/services';
import qs from 'query-string';
import { omit } from 'ramda';

import { IOperation } from '../../types';

import {
  fetchBalance,
  loadOperationsFail,
  loadOperationsRequest,
  loadOperationsSuccess,
  loadTypesFail,
  loadTypesRequest,
  loadTypesSuccess,
  setCurrentPage,
  setDateRange,
  setSelectedTypes,
  downloadDepositLedgerReportRequest,
  downloadDepositLedgerReportSuccess,
  downloadDepositLedgerReportFail,
} from './operations.actions';
import { IOperationType, IPagination, TBalance } from './operations.types';
import { getQueryParamsFromState } from './operations.helpers';

export const loadOperationsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadOperationsRequest),
    switchMap(() => {
      const { accountId, params } = getQueryParamsFromState({ state$ });
      return apiService
        .get(`/api/v1/reporting/resources/deposits/${accountId}/operations?${qs.stringify(params)}`, {}, true)
        .pipe(
          map((response: { data: IOperation[]; pagination: IPagination }) => loadOperationsSuccess(response)),
          catchError(errorHandler({ callbacks: loadOperationsFail })),
        );
    }),
  );

export const fetchBalanceEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(fetchBalance.pending),
    switchMap(() => {
      const { accountId, balanceAccountId, params } = getQueryParamsFromState({
        state$,
        dateRangeFieldNames: {
          fromName: 'filters[dateRange]',
          toName: 'filters[dateRange]',
        },
      });

      const requestParams = omit(
        ['operationTypes[]', 'filters[dateRange][toIncluded]', 'filters[dateRange][fromIncluded]', 'perPage', 'page'],
        params,
      );
      const resourceAccountId = balanceAccountId || accountId;

      return apiService
        .get(`/api/v1/reporting/resources/${resourceAccountId}/balance?${qs.stringify(requestParams)}`, {}, true)
        .pipe(
          map((response: IResponse<TBalance>) => fetchBalance.fulfilled(response.data)),
          catchError(
            handleError(
              handlers.handleAnyError(fetchBalance.rejected()),
              handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
            ),
          ),
        );
    }),
  );

export const setDateRangeEpic: Epic = action$ =>
  action$.pipe(
    ofType(setDateRange),
    mergeMap(() => [loadOperationsRequest(), fetchBalance.pending()]),
  );

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

export const depositLedgerOperationsReportEpic: Epic = (
  action$,
  state$,
  { apiService, downloadFile, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(downloadDepositLedgerReportRequest),
    switchMap(() => {
      const { accountId, params } = getQueryParamsFromState({ state$, isFullList: true });

      return apiService
        .getFile(`/api/v1/reporting/resources/export-deposit-ledger/${accountId}/operations?${qs.stringify(params)}`)
        .pipe(
          tap(blob => {
            downloadFile(blob, 'Deposit-ledger-report.xlsx');
          }),
          map(() => downloadDepositLedgerReportSuccess()),
          catchError(
            handleError(
              handlers.handleAnyError(downloadDepositLedgerReportFail),
              handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
            ),
          ),
        );
    }),
  );

export default [
  loadOperationsEpic,
  setDateRangeEpic,
  setSelectedTypesEpic,
  loadTypesEpic,
  setPageEpic,
  depositLedgerOperationsReportEpic,
  fetchBalanceEpic,
];
