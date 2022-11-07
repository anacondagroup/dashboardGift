import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { handlers, MessageType, TLegacyErrors } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import { from, timer } from 'rxjs';

import { ContactsUploadingStates } from '../../../../constants/recipientSidebar.constants';
import { setContactsUploadingSectionState } from '../../../ui/createPage/contactsSidebar';
import { ActivateModes } from '../../../../routePaths';
import { getActivateModuleParams } from '../../../activate.selectors';

import {
  downloadXLSXFileTemplateRequest,
  downloadXLSXFileTemplateSuccess,
  pollContactsUploadingFileFail,
  pollContactsUploadingFileFinish,
  pollContactsUploadingFileRequest,
  pollContactsUploadingFileSuccess,
  uploadRecipientListFail,
  uploadRecipientListRequest,
  uploadRecipientListSuccess,
} from './uploadRequest.actions';
import { IUploadRecipientsResponse, UploadRequestStatuses } from './uploadRequest.types';
import { getLastUploadingRequestEndpoint, isUploadRequestFaultless } from './uploadRequest.helpers';

const getUploadRecipientListEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/contacts/upload-requests/file`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/contacts/upload-requests/file`;
};

const uploadRecipientListEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(uploadRecipientListRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { file },
        },
        state,
      ]) => {
        const { campaignId, mode } = getActivateModuleParams(state);
        const body = new FormData();
        body.append('contacts', file, file.name);
        return apiService
          .postFile(
            getUploadRecipientListEndpoint(campaignId as number, mode as ActivateModes),
            {
              body,
            },
            true,
          )
          .pipe(
            mergeMap(({ data }: IUploadRecipientsResponse) => [
              uploadRecipientListSuccess(data?.attributes || null),
              setContactsUploadingSectionState(ContactsUploadingStates.Processing),
            ]),
            catchError(
              apiService.handleError(
                handlers.handleAnyError(uploadRecipientListFail),
                handlers.handleLegacyAnyError((errors: TLegacyErrors) =>
                  showGlobalMessage({
                    type: MessageType.Error,
                    text:
                      (errors?.contacts && errors?.contacts[0]) ||
                      'Ooops, error! File has not been uploaded, please retry',
                  }),
                ),
              ),
            ),
          );
      },
    ),
  );

const activatePollUploadingQueue: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) => {
  const stopPolling$ = action$.pipe(ofType(pollContactsUploadingFileFinish));
  return action$.pipe(
    ofType(pollContactsUploadingFileRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { campaignId },
        },
        state,
      ]) => {
        const { mode } = getActivateModuleParams(state);
        return timer(0, 2000).pipe(
          takeUntil(stopPolling$),
          switchMap(() =>
            from(
              apiService
                .get(getLastUploadingRequestEndpoint(campaignId as number, mode as ActivateModes), null, true)
                .pipe(
                  mergeMap(({ data }: IUploadRecipientsResponse) => {
                    if (data === null) {
                      return [pollContactsUploadingFileFinish()];
                    }

                    const { attributes } = data;
                    const uploadingStatus = attributes.status;
                    const noErrors = isUploadRequestFaultless(attributes);

                    if (uploadingStatus === UploadRequestStatuses.Complete && noErrors) {
                      return [
                        pollContactsUploadingFileSuccess(attributes),
                        pollContactsUploadingFileFinish(),
                        setContactsUploadingSectionState(ContactsUploadingStates.Completed),
                      ];
                    }
                    if (uploadingStatus === UploadRequestStatuses.Process) {
                      return [pollContactsUploadingFileSuccess(attributes)];
                    }
                    return [
                      pollContactsUploadingFileFail(attributes),
                      pollContactsUploadingFileFinish(),
                      setContactsUploadingSectionState(ContactsUploadingStates.Error),
                    ];
                  }),
                  catchError(error =>
                    errorHandler({ message: Array.isArray(error.errors) ? error.errors[0] : error.message })(error),
                  ),
                ),
            ),
          ),
        );
      },
    ),
  );
};

const downloadXLSXTemplateEpic: Epic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(downloadXLSXFileTemplateRequest),
    switchMap(() =>
      apiService.getFile('/api/v1/campaigns/activate/contacts/file-template').pipe(
        tap(blob => {
          downloadFile(blob, 'recipient_import_template.xlsx');
        }),
        map(downloadXLSXFileTemplateSuccess),
      ),
    ),
  );

export const uploadRequestEpics = [uploadRecipientListEpic, activatePollUploadingQueue, downloadXLSXTemplateEpic];
