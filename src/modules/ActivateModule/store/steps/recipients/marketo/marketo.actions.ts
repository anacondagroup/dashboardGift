import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { UploadRequestSourceTypes } from '../uploadRequest/uploadRequest.types';

import {
  IMarketoIntegrationData,
  IRequestMarketoFoldersPayload,
  ISuccessRequestMarketoFoldersPayload,
} from './marketo.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/MARKETO';

export const loadMarketoIntegrationDataRequest = createAction(`${PREFIX}/LOAD_DATA_REQUEST`);
export const loadMarketoIntegrationDataSuccess = createAction<IMarketoIntegrationData>(`${PREFIX}/LOAD_DATA_SUCCESS`);
export const loadMarketoIntegrationDataFail = createAction<TErrors>(`${PREFIX}/LOAD_DATA_FAIL`);

export const setMarketoListType = createAction<UploadRequestSourceTypes | undefined>(`${PREFIX}/SET_LIST_TYPE`);

export const loadMarketoFoldersRequest = createAction<IRequestMarketoFoldersPayload>(`${PREFIX}/LOAD_FOLDERS_REQUEST`);
export const loadMarketoFoldersSuccess = createAction<ISuccessRequestMarketoFoldersPayload>(
  `${PREFIX}/LOAD_FOLDERS_SUCCESS`,
);
export const loadMarketoFoldersFail = createAction(`${PREFIX}/LOAD_FOLDERS_FAIL`);
export const clearMarketoFolders = createAction(`${PREFIX}/CLEAR_FOLDERS`);

export const uploadMarketoStaticListRequest = createAction<{
  campaignId: number;
  staticListId: number;
  computedUrl: string;
}>(`${PREFIX}/UPLOAD_STATIC_LIST_REQUEST`);
export const uploadMarketoStaticListSuccess = createAction(`${PREFIX}/UPLOAD_STATIC_LIST_SUCCESS`);
export const uploadMarketoStaticListFail = createAction(`${PREFIX}/UPLOAD_STATIC_LIST_FAIL`);

export const uploadMarketoSmartListRequest = createAction<{
  campaignId: number;
  smartCampaignId: number;
  computedUrl: string;
}>(`${PREFIX}/UPLOAD_SMART_LIST_REQUEST`);
export const uploadMarketoSmartListSuccess = createAction(`${PREFIX}/UPLOAD_SMART_LIST_SUCCESS`);
export const uploadMarketoSmartListFail = createAction(`${PREFIX}/UPLOAD_SMART_LIST_FAIL`);
