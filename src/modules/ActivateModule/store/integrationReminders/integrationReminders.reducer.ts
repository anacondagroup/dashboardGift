import { EntityId, StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { sendReminder, sendReminderFail, sendReminderSuccess } from './integrationReminders.actions';

export type TIntegrationRemindersState = {
  status: StateStatus;
  data: Record<EntityId, number>;
};

export const initialState: TIntegrationRemindersState = {
  status: StateStatus.Idle,
  data: {},
};

export const integrationReminders = createReducer<TIntegrationRemindersState>({}, initialState);

integrationReminders.on(sendReminder, state => ({
  ...state,
  status: StateStatus.Pending,
}));

integrationReminders.on(sendReminderSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    ...state.data,
    [payload.userId]: payload.timestamp,
  },
}));

integrationReminders.on(sendReminderFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
