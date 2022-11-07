import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

const getContactState = (state: IRootState) => state.activate.steps.recipients.contact;
const getContactStateStatus = pipe(getContactState, state => state.status);

export const getIsContactSaving = pipe(getContactStateStatus, status => status === StateStatus.Pending);
export const getCreatedContact = pipe(getContactState, state => state.data);
export const getErrors = pipe(getContactState, state => state.errors);
