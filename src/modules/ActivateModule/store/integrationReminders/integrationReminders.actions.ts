import { createAction } from 'redux-act';
import { EntityId } from '@alycecom/utils';

const prefix = 'ACTIVATE_MODULE/UI/EDIT/INTEGRATION_REMINDERS';

export const sendReminder = createAction<{ campaignId: number; userId: EntityId }>(`${prefix}/SEND_REQUEST`);
export const sendReminderSuccess = createAction<{ campaignId: number; userId: EntityId; timestamp: number }>(
  `${prefix}/SEND_SUCCESS`,
);
export const sendReminderFail = createAction(`${prefix}/SEND_FAIL`);
