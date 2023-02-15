import { createAction } from 'redux-act';
import { createAsyncAction } from '@alycecom/utils';

import { TeamBudgetUtilizationThresholdResponse } from './notificationSettings.types';

const PREFIX = 'NOTIFICATION_SETTINGS';

export const setIsAdminNotify = createAction<boolean>(`${PREFIX}/SET_IS_ADMIN_NOTIFY`);
export const setIsSenderNotify = createAction<boolean>(`${PREFIX}/SET_IS_SENDER_NOTIFY`);
export const setSenderNotifyOption = createAction<string | undefined>(`${PREFIX}/SET_SENDER_NOTIFY_OPTION`);
export const setAdminNotifyOption = createAction<string | undefined>(`${PREFIX}/SET_ADMIN_NOTIFY_OPTION`);
export const cleanNotificationSettings = createAction<void>(`${PREFIX}/CLEAN_SETTINGS`);

export const getNotificationSettings = createAsyncAction<number, TeamBudgetUtilizationThresholdResponse>(
  `${PREFIX}/GET_UTILIZATION_THRESHOLD`,
);
export const updateNotificationSettings = createAsyncAction<number, void>(`${PREFIX}/UPDATE_UTILIZATION_THRESHOLD`);
