import { createReducer } from 'redux-act';

import {
  loadGeneralSettingsBatchOwnersRequest,
  loadGeneralSettingsBatchOwnersSuccess,
  loadGeneralSettingsBatchOwnersFail,
  generalSettingsClearBatchOwnersData,
} from './batchOwners.actions';
import { IMember } from './batchOwners.types';

export interface IBatchOwnersState {
  members: IMember[];
  isLoading: boolean;
  errors: Record<string, unknown>;
}

export const initialState: IBatchOwnersState = {
  members: [],
  isLoading: false,
  errors: {},
};

export const reducer = createReducer({}, initialState)
  .on(loadGeneralSettingsBatchOwnersRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadGeneralSettingsBatchOwnersSuccess, (state, payload) => ({
    ...state,
    members: payload,
    isLoading: false,
  }))
  .on(loadGeneralSettingsBatchOwnersFail, (state, payload) => ({
    ...state,
    isLoading: false,
    errors: payload,
  }))
  .on(generalSettingsClearBatchOwnersData, () => ({
    ...initialState,
  }));
