import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { loadActivateSuccess, clearActivateModuleState } from '../../../activate.actions';

import { IUploadRequestAttributes } from './uploadRequest.types';
import {
  pollContactsUploadingFileFail,
  pollContactsUploadingFileSuccess,
  uploadRecipientListFail,
  uploadRecipientListRequest,
  uploadRecipientListSuccess,
} from './uploadRequest.actions';

export interface IUploadRequestState {
  status: StateStatus;
  attributes: IUploadRequestAttributes | null;
}

export const initialRecipientState: IUploadRequestState = {
  status: StateStatus.Idle,
  attributes: null,
};

export const uploadRequest = createReducer({}, initialRecipientState);

uploadRequest.on(loadActivateSuccess, (state, payload) => ({
  ...state,
  attributes: payload.recipients.attributes,
}));

uploadRequest.on(clearActivateModuleState, () => ({
  ...initialRecipientState,
}));

uploadRequest.on(uploadRecipientListRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

uploadRequest.on(uploadRecipientListSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  attributes: payload,
}));

uploadRequest.on(uploadRecipientListFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

uploadRequest.on(pollContactsUploadingFileSuccess, (state, payload) => ({
  ...state,
  attributes: payload,
}));

uploadRequest.on(pollContactsUploadingFileFail, (state, payload) => ({
  ...state,
  attributes: payload,
}));
