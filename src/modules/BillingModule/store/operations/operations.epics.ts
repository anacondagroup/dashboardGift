import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, flatMap, mapTo, switchMap, map, tap } from 'rxjs/operators';
import { IListResponse, handleError, handlers, MessageType } from '@alycecom/services';
import qs from 'query-string';

import { getSelectedAccount } from '../customerOrg';
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
  downloadDepositLedgerReportRequest,
  downloadDepositLedgerReportSuccess,
  downloadDepositLedgerReportFail,
} from './operations.actions';
import { IOperationType, IPagination } from './operations.types';
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
];
