import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, flatMap, mapTo, switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { IListResponse, handleError, handlers, MessageType, IListResponseWithPagination } from '@alycecom/services';
import qs from 'query-string';

import { getSelectedAccount, getOrg } from '../customerOrg';
import { IOperation } from '../../types';

import {
  loadGiftWithdrawalOnDateRange,
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
import { TGiftWithdrawalTotal, IOperationType, IPagination } from './operations.types';
import { getDateRange, getSelectedTypes, getPagination } from './operations.selectors';

export const loadOperationsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadOperationsRequest),
    switchMap(() => {
      const { accountId } = getSelectedAccount(state$.value);
      const dateRange = getDateRange(state$.value);
      const operationTypes = getSelectedTypes(state$.value);
      const params: Record<string, string | boolean | number | qs.Stringifiable[]> = {};
      const { perPage, currentPage } = getPagination(state$.value);
      if (dateRange.from) {
        params['dateRange[from]'] = dateRange.from;
        params['dateRange[fromIncluded]'] = true;
      }
      if (dateRange.to) {
        params['dateRange[to]'] = dateRange.to;
        params['dateRange[toIncluded]'] = true;
      }
      params['operationTypes[]'] = operationTypes;
      params.perPage = perPage;
      params.page = currentPage;

      return apiService
        .get(`/api/v1/reporting/resources/deposits/${accountId}/operations?${qs.stringify(params)}`, {}, true)
        .pipe(
          mergeMap((response: { data: IOperation[]; pagination: IPagination }) => [
            loadOperationsSuccess(response),
            loadGiftWithdrawalOnDateRange.pending(),
          ]),
          catchError(errorHandler({ callbacks: loadOperationsFail })),
        );
    }),
  );

export const loadGiftWithdrawalOnDateRangeEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(loadGiftWithdrawalOnDateRange.pending),
    switchMap(() => {
      const { id: orgId } = getOrg(state$.value);
      const { accountId } = getSelectedAccount(state$.value);
      const { from, to } = getDateRange(state$.value);
      const operationTypes = getSelectedTypes(state$.value);
      const params: Record<string, string | boolean | number | qs.Stringifiable[]> = {};
      const { perPage, currentPage } = getPagination(state$.value);
      if (from) {
        params['filters[operatedAt][from]'] = from;
        params['filters[operated][fromIncluded]'] = true;
      }
      if (to) {
        params['filters[operatedAt][to]]'] = to;
        params['filters[operated][toIncluded]'] = true;
      }
      params['operationTypes[]'] = operationTypes;
      params.perPage = perPage;
      params.page = currentPage;

      return apiService
        .get(
          `/api/v1/reporting/resources/billing/${orgId}/${accountId}/gift-withdrawals?${qs.stringify(params)}`,
          {},
          true,
        )
        .pipe(
          map((response: IListResponseWithPagination<TGiftWithdrawalTotal>) =>
            loadGiftWithdrawalOnDateRange.fulfilled(response),
          ),
          catchError(
            handleError(
              handlers.handleAnyError(loadGiftWithdrawalOnDateRange.rejected()),
              handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
            ),
          ),
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
        flatMap((response: IListResponse<IOperationType>) => [loadTypesSuccess(response.data)]),
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
    switchMap(({ payload }) => {
      const { accountId } = getSelectedAccount(state$.value);
      const dateRange = getDateRange(state$.value);
      const operationTypes = getSelectedTypes(state$.value);
      const params: Record<string, string | boolean | number | qs.Stringifiable[]> = {};
      if (dateRange.from) {
        params['dateRange[from]'] = dateRange.from;
        params['dateRange[fromIncluded]'] = true;
      }
      if (dateRange.to) {
        params['dateRange[to]'] = dateRange.to;
        params['dateRange[toIncluded]'] = true;
      }
      params['operationTypes[]'] = operationTypes;
      params.perPage = payload.total;
      params.page = payload.currentPage;

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
  loadGiftWithdrawalOnDateRangeEpic,
];
