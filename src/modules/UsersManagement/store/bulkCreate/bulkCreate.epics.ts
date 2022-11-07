import { Epic, ofType } from 'redux-observable';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, IListResponse, MessageType } from '@alycecom/services';
import { timer } from 'rxjs';
import { Action } from 'redux';

import { addUserDrafts } from '../entities/userDrafts/userDrafts.actions';
import { setUsersSidebarStep } from '../usersOperation/usersOperation.actions';
import { UsersSidebarStep } from '../usersOperation/usersOperation.types';
import { IUserDraft } from '../entities/userDrafts/userDrafts.types';
import { transformUserDraftsToMap } from '../entities/userDrafts/userDrafts.helpers';
import { refreshUsersRequest } from '../users/users.actions';

import {
  downloadBulkInviteTemplate,
  downloadBulkInviteTemplateSuccess,
  uploadFileFail,
  uploadFileRequest,
  uploadFileSuccess,
  waitForBulkCreateUsers,
  waitForBulkCreateUsersCancel,
  waitForBulkCreateUsersFail,
  waitForBulkCreateUsersUpdate,
} from './bulkCreate.actions';
import { CreateUsersStatus, IBulkCreateStatus } from './bulkCreate.types';
import { getImportId } from './bulkCreate.selectors';

export const downloadBulkTemplateEpic: Epic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(downloadBulkInviteTemplate),
    switchMap(() =>
      apiService.getFile(`/api/v1/users/bulk-example?t=${Date.now()}`).pipe(
        tap(blob => {
          downloadFile(blob, 'bulk_upload_template.xlsx');
        }),
        map(downloadBulkInviteTemplateSuccess),
        catchError(handleError(handlers.handleAnyError())),
      ),
    ),
  );

export const bulkUploadFileEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(uploadFileRequest),
    mergeMap(({ payload: file, meta: orgName }) => {
      const formData = new FormData();
      formData.append('members', file, file.name);
      return apiService
        .postFile(
          `/api/v1/users/bulk-upload`,
          {
            body: formData,
          },
          true,
        )
        .pipe(
          mergeMap((response: IListResponse<IUserDraft>) => [
            uploadFileSuccess(),
            addUserDrafts({ users: transformUserDraftsToMap(response.data, orgName) }),
            setUsersSidebarStep(UsersSidebarStep.importedUsersInfo),
          ]),
          catchError(handleError(handlers.handleAnyError(uploadFileFail))),
        );
    }),
  );

export const bulkCreateUsersStatusEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(waitForBulkCreateUsers),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      timer(0, 5000).pipe(
        takeUntil(action$.pipe(ofType(...[waitForBulkCreateUsersCancel, waitForBulkCreateUsersFail]))),
        switchMap(() =>
          apiService.get(`/api/v1/users/import/${getImportId(state)}/status`, null, true).pipe(
            mergeMap((response: IBulkCreateStatus) => {
              const actions: Action[] = [];
              const shouldStopBulk = [CreateUsersStatus.finished, CreateUsersStatus.failed].includes(response.status);
              if (shouldStopBulk) {
                actions.push(waitForBulkCreateUsersCancel());
              }
              if (response.status === CreateUsersStatus.finished) {
                actions.push(showGlobalMessage({ type: MessageType.Success, text: 'Users created successfully.' }));
                actions.push(refreshUsersRequest());
              }
              if (response.status === CreateUsersStatus.failed) {
                actions.push(
                  showGlobalMessage({ type: MessageType.Error, text: 'Something wrong during creating users.' }),
                );
              }
              actions.push(waitForBulkCreateUsersUpdate(response));
              return actions;
            }),
            catchError(handleError(handlers.handleAnyError(waitForBulkCreateUsersFail))),
          ),
        ),
      ),
    ),
  );

export const bulkEpics = [downloadBulkTemplateEpic, bulkUploadFileEpic, bulkCreateUsersStatusEpic];
