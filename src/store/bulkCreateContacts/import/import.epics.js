import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom, tap, switchMap, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { TrackEvent } from '@alycecom/services';
import { Auth, User } from '@alycecom/modules';
import { applySpec } from 'ramda';

import {
  BULK_UPLOAD_DOWNLOAD_TEMPLATE,
  BULK_UPLOAD_FILE_UPLOAD_REQUEST,
  BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_REQUEST,
  BULK_IMPORT_REQUEST,
  BULK_CREATE,
} from './import.types';
import {
  uploadFileSuccess,
  uploadFileFail,
  downloadTemplateSuccess,
  getAvailableCampaignsSuccess,
  bulkImportSuccess,
  bulkImportFail,
  bulkImportValidationErrors,
  waitForBulkImportCancel,
  waitForBulkImportFail,
  waitForBulkImportUpdate,
} from './import.actions';

export const uploadFileEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(BULK_UPLOAD_FILE_UPLOAD_REQUEST),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            adminId: Auth.selectors.getLoginAsAdminId,
            orgId: User.selectors.getOrgId,
            orgName: User.selectors.getOrgName,
          }),
        ),
      ),
    ),
    mergeMap(([{ payload }, { adminId, orgId, orgName }]) => {
      const formData = new FormData();
      formData.append('contacts', payload.file, payload.name);
      formData.append('campaign_id', payload.campaignId);
      return apiService.postFile(`/enterprise/gift-create/bulk/load-contacts`, { body: formData }).pipe(
        mergeMap(({ contacts, errors, importId }) => [
          uploadFileSuccess({ contacts, errors, importId }),
          TrackEvent.actions.trackEvent({
            name: 'Contacts list — uploaded',
            payload: {
              contactsLength: contacts.length,
              withErrors: Object.keys(errors).length !== 0,
              adminId,
            },
            options: {
              groupId: orgId,
              traits: {
                adminId,
                orgId,
                orgName,
              },
            },
          }),
        ]),
        catchError(errorHandler({ callbacks: uploadFileFail, showErrorsAsGlobal: true })),
      );
    }),
  );

export const downloadTemplateEpic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(BULK_UPLOAD_DOWNLOAD_TEMPLATE),
    mergeMap(() =>
      apiService.getFile(`/enterprise/dashboard/gift-create/bulk/load/example?time=${Date.now()}`).pipe(
        withLatestFrom(state$.pipe(map(() => 'bulk_import_template.xlsx'))),
        tap(([blob, filename]) => {
          downloadFile(blob, filename);
        }),
        map(downloadTemplateSuccess),
      ),
    ),
  );

export const getAvailableCampaignsEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .get(`/enterprise/gift-create/available-campaigns/${payload}`)
        .pipe(map(response => getAvailableCampaignsSuccess(response.campaigns))),
    ),
  );

export const bulkImportEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(BULK_IMPORT_REQUEST),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/gift-create/bulk/import/create`, { body: payload }).pipe(
        map(response => bulkImportSuccess(response)),
        catchError(error => {
          const isValidationError = error.status === 200;
          return errorHandler({
            callbacks: isValidationError ? bulkImportValidationErrors : bulkImportFail,
            showErrorsAsGlobal: !isValidationError,
          })(error);
        }),
      ),
    ),
  );

export const bulkCreatePollingEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(BULK_CREATE.WAIT_FOR_IMPORT_START),
    switchMap(({ payload: importId }) =>
      timer(0, 5000).pipe(
        takeUntil(action$.pipe(ofType(BULK_CREATE.WAIT_FOR_IMPORT_CANCEL, BULK_CREATE.WAIT_FOR_IMPORT_FAIL))),
        switchMap(() =>
          apiService.get(`/enterprise/gift-create/bulk/import/${importId}/status`).pipe(
            mergeMap(response => {
              if (['failed', 'finished'].includes(response.status)) {
                return [waitForBulkImportCancel(), waitForBulkImportUpdate(response)];
              }

              return [waitForBulkImportUpdate(response)];
            }),
            catchError(errorHandler({ callbacks: waitForBulkImportFail })),
          ),
        ),
      ),
    ),
  );

export const importEpic = [
  uploadFileEpic,
  downloadTemplateEpic,
  getAvailableCampaignsEpic,
  bulkImportEpic,
  bulkCreatePollingEpic,
];
