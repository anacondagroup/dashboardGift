import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers, ILegacyResponseError, MessageType, TAnyResponseError } from '@alycecom/services';
import { forkJoin } from 'rxjs';
import { ofType } from '@alycecom/utils';

import { uploadRecipientListSuccess } from '../index';
import { IUploadRecipientsResponse } from '../uploadRequest/uploadRequest.types';
import { clearContactsSidebar, setContactsUploadingSectionState } from '../../../ui/createPage/contactsSidebar';
import { ContactsUploadingStates } from '../../../../constants/recipientSidebar.constants';
import { getActivateModuleParams } from '../../../activate.selectors';
import { ActivateModes } from '../../../../routePaths';

import {
  clearMarketoFolders,
  loadMarketoFoldersRequest,
  loadMarketoFoldersSuccess,
  loadMarketoIntegrationDataFail,
  loadMarketoIntegrationDataRequest,
  loadMarketoIntegrationDataSuccess,
  uploadMarketoSmartListFail,
  uploadMarketoSmartListRequest,
  uploadMarketoSmartListSuccess,
  uploadMarketoStaticListFail,
  uploadMarketoStaticListRequest,
  uploadMarketoStaticListSuccess,
} from './marketo.actions';
import {
  IMarketoFolder,
  IMarketoIntegrationData,
  IMarketoStaticList,
  IRequestMarketoFoldersPayload,
} from './marketo.types';
import { createQuery, getMarketoAssetNameBasedOnListType, leaveFirstFolder } from './marketo.helpers';

const getMarketoStaticSourceUpdateEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/contacts/upload-requests/marketo-static`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/contacts/upload-requests/marketo-static`;
};

const getMarketoDynamicSourceUpdateEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/contacts/upload-requests/marketo-dynamic`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/contacts/upload-requests/marketo-dynamic`;
};

export const loadMarketoIntegrationDataEpic: Epic = (action$, state$, { apiService, marketoService }) =>
  action$.pipe(
    ofType(loadMarketoIntegrationDataRequest),
    switchMap(() =>
      marketoService.get('/api/v1/marketing/marketo/integrations', {}, true).pipe(
        map((response: IMarketoIntegrationData[]) => {
          if (response.length > 0 && response[0].status === 'active') {
            return loadMarketoIntegrationDataSuccess(response[0]);
          }
          return loadMarketoIntegrationDataFail({ integration: ['Inactive integration'] });
        }),
        catchError(apiService.handleError(handlers.handleAnyError(loadMarketoIntegrationDataFail))),
      ),
    ),
  );

export const loadMarketoFoldersEpic: Epic = (
  action$,
  state$,
  { marketoService, apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(loadMarketoFoldersRequest),
    switchMap(({ payload }) => {
      const requestFolders = ({ uuid, node }: IRequestMarketoFoldersPayload) =>
        marketoService.get(
          `/api/v1/marketing/marketo/integrations/${uuid}/assets/folders${createQuery(node)}`,
          null,
          true,
        );
      const requestStaticLists = ({ uuid, node, listType }: IRequestMarketoFoldersPayload) =>
        marketoService.get(
          `/api/v1/marketing/marketo/integrations/${uuid}/assets/${getMarketoAssetNameBasedOnListType(
            listType,
          )}${createQuery(node)}`,
          null,
          true,
        );

      return forkJoin(
        payload.node
          ? {
              folders: requestFolders(payload),
              staticLists: requestStaticLists(payload),
            }
          : { folders: requestFolders(payload) },
      ).pipe(
        switchMap(response => {
          const folders = response.folders as IMarketoFolder[];
          const staticLists = response.staticLists as IMarketoStaticList[] | undefined;

          return [
            loadMarketoFoldersSuccess({
              folders: !payload.node ? leaveFirstFolder(folders) : folders,
              staticLists,
              parentId: payload.node && payload.node.id,
            }),
          ];
        }),

        catchError(
          apiService.handleError(
            handlers.handleAnyError(
              loadMarketoIntegrationDataFail,
              clearMarketoFolders,
              clearContactsSidebar,
              (_: unknown, error: TAnyResponseError) =>
                showGlobalMessage({
                  type: MessageType.Error,
                  text: (error as ILegacyResponseError).message || 'Error validating integration',
                }),
            ),
          ),
        ),
      );
    }),
  );

export const uploadMarketoStaticListEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(uploadMarketoStaticListRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { mode } = getActivateModuleParams(state);
      const requestData = {
        body: {
          staticListId: payload.staticListId,
          computedUrl: payload.computedUrl,
        },
      };
      return apiService
        .post(getMarketoStaticSourceUpdateEndpoint(payload.campaignId, mode as ActivateModes), requestData, true)
        .pipe(
          mergeMap(({ data }: IUploadRecipientsResponse) => [
            uploadMarketoStaticListSuccess(),
            uploadRecipientListSuccess(data?.attributes || null),
            setContactsUploadingSectionState(ContactsUploadingStates.Processing),
          ]),
          catchError(apiService.handleError(handlers.handleAnyError(uploadMarketoStaticListFail))),
        );
    }),
  );

export const uploadMarketoSmartCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(uploadMarketoSmartListRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { mode } = getActivateModuleParams(state);
      const requestData = {
        body: {
          smartCampaignId: payload.smartCampaignId,
          computedUrl: payload.computedUrl,
        },
      };
      return apiService
        .post(getMarketoDynamicSourceUpdateEndpoint(payload.campaignId, mode as ActivateModes), requestData, true)
        .pipe(
          mergeMap(({ data }) => [
            uploadMarketoSmartListSuccess(),
            uploadRecipientListSuccess(data?.attributes || null),
            setContactsUploadingSectionState(ContactsUploadingStates.Processing),
          ]),
          catchError(apiService.handleError(handlers.handleAnyError(uploadMarketoSmartListFail))),
        );
    }),
  );

export const marketoEpics = [
  loadMarketoIntegrationDataEpic,
  loadMarketoFoldersEpic,
  uploadMarketoStaticListEpic,
  uploadMarketoSmartCampaignEpic,
];
