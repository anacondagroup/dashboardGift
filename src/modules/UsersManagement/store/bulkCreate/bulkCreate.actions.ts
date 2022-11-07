import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';

import { IBulkCreateStatus } from './bulkCreate.types';

const PREFIX = 'USERS_MANAGEMENT/BULK';

export const downloadBulkInviteTemplate = createAction<void>(`${PREFIX}/DOWNLOAD_BULK_INVITE_REQUEST`);
export const downloadBulkInviteTemplateSuccess = createAction<void>(`${PREFIX}/DOWNLOAD_BULK_INVITE_SUCCESS`);

export const uploadFileRequest = createAction(
  `${PREFIX}/UPLOAD_FILE_REQUEST`,
  ({ file }: { file: File }, _: string) => file,
  (_, orgName: string = '') => orgName,
);
export const uploadFileSuccess = createAction<void>(`${PREFIX}/UPLOAD_FILE_SUCCESS`);
export const uploadFileFail = createAction<TErrors>(`${PREFIX}/UPLOAD_FILE_FAIL`);

export const setUploadFileStatus = createAction<StateStatus>(`${PREFIX}/SET_UPLOAD_FILE_STATUS`);

export const waitForBulkCreateUsers = createAction<{ importId: string }>(
  `${PREFIX}/WAIT_FOR BULK_CREATE_USERS_REQUEST`,
);
export const waitForBulkCreateUsersCancel = createAction<void>(`${PREFIX}/WAIT_FOR BULK_CREATE_USERS_CANCEL`);
export const waitForBulkCreateUsersUpdate = createAction<IBulkCreateStatus>(
  `${PREFIX}/WAIT_FOR BULK_CREATE_USERS_UPDATE`,
);
export const waitForBulkCreateUsersFail = createAction<TErrors>(`${PREFIX}/WAIT_FOR BULK_CREATE_USERS_FAIL`);
