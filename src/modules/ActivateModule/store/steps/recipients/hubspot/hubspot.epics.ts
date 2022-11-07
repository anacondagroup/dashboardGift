import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers } from '@alycecom/services';

import { uploadRecipientListSuccess } from '../uploadRequest';
import { setContactsUploadingSectionState, setSourceType } from '../../../ui/createPage/contactsSidebar';
import { ContactsUploadingStates, SourceTypes } from '../../../../constants/recipientSidebar.constants';
import { IUploadRecipientsResponse } from '../uploadRequest/uploadRequest.types';
import { getActivateModuleParams } from '../../../activate.selectors';
import { ActivateModes } from '../../../../routePaths';

import {
  saveHubSpotSourceTypeFail,
  saveHubSpotSourceTypeRequest,
  saveHubSpotSourceTypeSuccess,
} from './hubspot.actions';

const getHubspotSourceTypeUpdateEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/contacts/upload-requests/hubspot`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/contacts/upload-requests/hubspot`;
};

const setHubSpotSourceTypeEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(saveHubSpotSourceTypeRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { campaignId, mode } = getActivateModuleParams(state);
      return apiService
        .post(getHubspotSourceTypeUpdateEndpoint(campaignId as number, mode as ActivateModes), null, true)
        .pipe(
          mergeMap(({ data }: IUploadRecipientsResponse) => [
            saveHubSpotSourceTypeSuccess(),
            uploadRecipientListSuccess(data?.attributes || null),
            setSourceType(SourceTypes.HubSpot),
            setContactsUploadingSectionState(ContactsUploadingStates.Completed),
          ]),
          catchError(apiService.handleError(handlers.handleAnyError(saveHubSpotSourceTypeFail))),
        );
    }),
  );

export const hubspotEpics = [setHubSpotSourceTypeEpic];
