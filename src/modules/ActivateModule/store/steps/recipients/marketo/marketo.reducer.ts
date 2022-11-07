import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState, loadActivateSuccess } from '../../../activate.actions';
import { UploadRequestSourceTypes } from '../uploadRequest/uploadRequest.types';

import {
  clearMarketoFolders,
  loadMarketoFoldersFail,
  loadMarketoFoldersRequest,
  loadMarketoFoldersSuccess,
  loadMarketoIntegrationDataFail,
  loadMarketoIntegrationDataRequest,
  loadMarketoIntegrationDataSuccess,
  setMarketoListType,
  uploadMarketoSmartListFail,
  uploadMarketoSmartListRequest,
  uploadMarketoSmartListSuccess,
  uploadMarketoStaticListFail,
  uploadMarketoStaticListRequest,
  uploadMarketoStaticListSuccess,
} from './marketo.actions';
import { IMarketoIntegrationData, MarketoNode } from './marketo.types';
import { createDataTree, setNodeIsLoading, Tree } from './marketo.helpers';

export interface IMarketoState {
  status: StateStatus;
  data?: IMarketoIntegrationData;
  selectedListType?: UploadRequestSourceTypes;

  isLoading: boolean;
  folders: MarketoNode[];
  root?: Tree<MarketoNode>[];
  error?: TErrors;
}

export const initialMarketoState: IMarketoState = {
  status: StateStatus.Idle,
  data: undefined,
  selectedListType: undefined,
  isLoading: false,
  folders: [],
  root: undefined,
  error: undefined,
};

export const marketo = createReducer({}, initialMarketoState);

marketo.on(loadActivateSuccess, (state, { recipients }) => {
  const source = recipients?.attributes?.source;
  let selectedListType: UploadRequestSourceTypes | undefined;

  if (source && source !== UploadRequestSourceTypes.File) {
    selectedListType = source;
  }

  return {
    ...state,
    selectedListType,
  };
});

marketo.on(clearActivateModuleState, () => ({
  ...initialMarketoState,
}));

marketo.on(setMarketoListType, (state, payload) => ({
  ...state,
  selectedListType: payload,
}));

marketo.on(loadMarketoIntegrationDataRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
marketo.on(loadMarketoIntegrationDataSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: payload,
}));
marketo.on(loadMarketoIntegrationDataFail, (state, payload) => ({
  ...state,
  status: StateStatus.Rejected,
  error: payload,
}));

marketo.on(loadMarketoFoldersRequest, (state, payload) => {
  if (!payload.node) {
    return {
      ...state,
      isLoading: true,
      folders: [],
    };
  }
  return {
    ...state,
    isLoading: true,
    root: setNodeIsLoading(state.folders, payload.node.id),
  };
});
marketo.on(loadMarketoFoldersSuccess, (state, { folders, staticLists }) => {
  const staticList = staticLists || [];
  const allFolders = [...state.folders, ...folders, ...staticList];
  return {
    ...state,
    isLoading: false,
    folders: allFolders,
    root: createDataTree(allFolders),
  };
});
marketo.on(loadMarketoFoldersFail, state => ({
  ...state,
  isLoading: false,
}));
marketo.on(clearMarketoFolders, state => ({
  ...state,
  selectedListType: undefined,
  isLoading: false,
  folders: [],
  root: undefined,
  error: undefined,
}));

marketo.on(uploadMarketoStaticListRequest, state => ({
  ...state,
  isLoading: true,
}));
marketo.on(uploadMarketoStaticListSuccess, state => ({
  ...state,
  isLoading: false,
}));
marketo.on(uploadMarketoStaticListFail, state => ({
  ...state,
  isLoading: false,
}));

marketo.on(uploadMarketoSmartListRequest, state => ({
  ...state,
  isLoading: true,
}));
marketo.on(uploadMarketoSmartListSuccess, state => ({
  ...state,
  isLoading: false,
}));
marketo.on(uploadMarketoSmartListFail, state => ({
  ...state,
  isLoading: false,
}));
