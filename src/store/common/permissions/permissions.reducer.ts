import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { TPermissions } from './permissions.types';
import { fetchPermissions } from './permissions.actions';

export type TPermissionsState = {
  status: StateStatus;
  data: TPermissions;
};

const initialState: TPermissionsState = {
  status: StateStatus.Idle,
  data: [],
};

export const permissions = createReducer<TPermissionsState>({}, initialState);

permissions
  .on(fetchPermissions.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchPermissions.fulfilled, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data: payload.permissions,
  }))
  .on(fetchPermissions.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
