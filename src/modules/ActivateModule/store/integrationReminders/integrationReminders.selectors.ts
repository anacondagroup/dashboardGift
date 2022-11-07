import { EntityId } from '@alycecom/utils';
import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

import { TIntegrationRemindersState } from './integrationReminders.reducer';

const getIntegrationReminders = (state: IRootState): TIntegrationRemindersState => state.activate.integrationReminders;

export const getRemindersMap = pipe(getIntegrationReminders, state => state.data);

export const getReminderTimeByUserId = (userId: EntityId): ((state: IRootState) => number | undefined) =>
  pipe(getIntegrationReminders, state => state.data[userId]);
