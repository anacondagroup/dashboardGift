import { combineReducers } from 'redux';

import { permissions, TPermissionsState } from './permissions/permissions.reducer';
import stateUpdatedTimeReducer from './stateUpdatedTime/stateUpdatedTime.reducer';
import { invitations } from './invitations/invitations.reducer';
import notifications from './notifications/notifications.reducer';
// TODO Replace with described state
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommonState {
  permissions: TPermissionsState;
  [key: string]: any;
}

export default combineReducers<ICommonState>({
  permissions,
  stateUpdatedTime: stateUpdatedTimeReducer,
  invitations,
  notifications,
});
