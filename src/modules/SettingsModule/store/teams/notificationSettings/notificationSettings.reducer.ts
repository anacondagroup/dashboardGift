import { createReducer } from 'redux-act';

import * as actions from './notificationSettings.actions';
import { INotificationSettingsTypes } from './notificationSettings.types';

export interface INotificationSettingsState extends INotificationSettingsTypes {}
export const initialState: INotificationSettingsTypes = {
  isAdminNotify: false,
  isSenderNotify: false,
  adminNotifyOption: '',
  senderNotifyOption: '',
  isLoading: false,
};

export const reducer = createReducer<INotificationSettingsTypes>({}, initialState);

reducer
  // eslint-disable-next-line unused-imports/no-unused-vars
  .on(actions.getNotificationSettings.pending, (state, teamId) => ({
    ...state,
    isLoading: true,
  }))
  .on(actions.getNotificationSettings.fulfilled, (state, payload) => ({
    ...state,
    isAdminNotify: payload.admin.notifyEnabled,
    adminNotifyOption: `${payload.admin.notifyType}_${payload.admin.notifyAtPercent}`,
    isSenderNotify: payload.member.notifyEnabled,
    senderNotifyOption: `${payload.member.notifyType}_${payload.member.notifyAtPercent}`,
    isLoading: true,
  }))
  // eslint-disable-next-line unused-imports/no-unused-vars
  .on(actions.updateNotificationSettings.pending, (state, teamId) => ({
    ...state,
    isLoading: false,
  }))
  .on(actions.setIsAdminNotify, (state, payload) => ({
    ...state,
    isAdminNotify: payload,
  }))
  .on(actions.setSenderNotifyOption, (state, payload) => ({
    ...state,
    senderNotifyOption: payload,
  }))
  .on(actions.setIsSenderNotify, (state, payload) => ({
    ...state,
    isSenderNotify: payload,
  }))
  .on(actions.cleanNotificationSettings, () => ({
    ...initialState,
  }))
  .on(actions.setAdminNotifyOption, (state, payload) => ({
    ...state,
    adminNotifyOption: payload,
  }));
