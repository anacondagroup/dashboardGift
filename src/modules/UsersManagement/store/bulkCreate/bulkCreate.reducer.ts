import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFail,
  setUploadFileStatus,
  waitForBulkCreateUsers,
  waitForBulkCreateUsersUpdate,
} from './bulkCreate.actions';

export interface IBulkCreateState {
  importId: string;
  imported: number;
  total: number;
  fileStatus: StateStatus;
}

export const initialState: IBulkCreateState = {
  importId: '',
  imported: 0,
  total: 0,
  fileStatus: StateStatus.Idle,
};

export const bulkCreate = createReducer<IBulkCreateState>({}, initialState);

bulkCreate
  .on(uploadFileRequest, state => ({
    ...state,
    fileStatus: StateStatus.Pending,
  }))
  .on(uploadFileSuccess, state => ({
    ...state,
    fileStatus: StateStatus.Fulfilled,
  }))
  .on(uploadFileFail, state => ({
    ...state,
    fileStatus: StateStatus.Rejected,
  }));

bulkCreate.on(setUploadFileStatus, (state, payload) => ({
  ...state,
  fileStatus: payload,
}));

bulkCreate
  .on(waitForBulkCreateUsers, (state, payload) => ({
    ...state,
    importId: payload.importId,
  }))
  .on(waitForBulkCreateUsersUpdate, (state, { imported, total }) => ({
    ...state,
    importId: imported === total ? '' : state.importId,
    imported,
    total,
  }));
