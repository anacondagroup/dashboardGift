import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { isRecipientsStepCompleted } from './recipients.helpers';

const getRecipientsState = (state: IRootState) => state.activate.steps.recipients.uploadRequest;

export const getIsRecipientsSourceTypeDefined = pipe(getRecipientsState, state => !!state.attributes?.source);

export const getIsRecipientsStepCompleted = pipe(getRecipientsState, state => {
  if (!state.attributes) {
    return false;
  }
  return isRecipientsStepCompleted(state.attributes);
});
