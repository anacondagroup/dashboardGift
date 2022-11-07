import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handlers } from '@alycecom/services';

import { getActivateModuleParams } from '../../../activate.selectors';
import { setContactsUploadingSectionState, setSourceType } from '../../../ui/createPage/contactsSidebar';
import { ContactsUploadingStates, SourceTypes } from '../../../../constants/recipientSidebar.constants';
import { uploadRecipientListSuccess } from '../uploadRequest';
import { IUploadRecipientsResponse } from '../uploadRequest/uploadRequest.types';
import { ActivateModes } from '../../../../routePaths';

import { saveEloquaSourceTypeFail, saveEloquaSourceTypeRequest, saveEloquaSourceTypeSuccess } from './eloqua.actions';

const getEloquaSourceTypeUpdateEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/contacts/upload-requests/eloqua`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/contacts/upload-requests/eloqua`;
};

const setEloquaSourceTypeEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(saveEloquaSourceTypeRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { campaignId, mode } = getActivateModuleParams(state);
      return apiService
        .post(getEloquaSourceTypeUpdateEndpoint(campaignId as number, mode as ActivateModes), null, true)
        .pipe(
          mergeMap(({ data }: IUploadRecipientsResponse) => [
            saveEloquaSourceTypeSuccess(),
            uploadRecipientListSuccess(data?.attributes || null),
            setSourceType(SourceTypes.Eloqua),
            setContactsUploadingSectionState(ContactsUploadingStates.Completed),
          ]),
          catchError(apiService.handleError(handlers.handleAnyError(saveEloquaSourceTypeFail))),
        );
    }),
  );

export const eloquaEpics = [setEloquaSourceTypeEpic];
