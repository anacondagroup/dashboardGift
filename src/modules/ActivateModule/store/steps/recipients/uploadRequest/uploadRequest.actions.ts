import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IUploadRequestAttributes } from './uploadRequest.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/UPLOAD_REQUEST';

export const uploadRecipientListRequest = createAction<{ file: File; campaignId: number }>(
  `${PREFIX}/UPLOAD_LIST_REQUEST`,
);
export const uploadRecipientListSuccess = createAction<IUploadRequestAttributes | null>(
  `${PREFIX}/UPLOAD_LIST_SUCCESS`,
);
export const uploadRecipientListFail = createAction<TErrors>(`${PREFIX}/UPLOAD_LIST_FAIL`);

export const downloadXLSXFileTemplateRequest = createAction(`${PREFIX}/DOWNLOAD_TEMPLATE_FAIL`);
export const downloadXLSXFileTemplateSuccess = createAction(`${PREFIX}/DOWNLOAD_TEMPLATE_SUCCESS`);

export const pollContactsUploadingFileRequest = createAction<{ campaignId: number }>(`${PREFIX}/POLL_REQUEST`);
export const pollContactsUploadingFileSuccess = createAction<IUploadRequestAttributes>(`${PREFIX}/POLL_SUCCESS`);
export const pollContactsUploadingFileFinish = createAction(`${PREFIX}/POLL_FINISH`);
export const pollContactsUploadingFileFail = createAction<IUploadRequestAttributes>(`${PREFIX}/POLL_FAIL`);
