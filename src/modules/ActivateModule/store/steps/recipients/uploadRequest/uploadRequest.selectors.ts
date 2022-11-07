import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

const getRecipientsState = (state: IRootState) => state.activate.steps.recipients.uploadRequest;

export const getIsRecipientsLoading = pipe(getRecipientsState, state => state.status === StateStatus.Pending);
export const getUploadRequestAttributes = pipe(getRecipientsState, state => state.attributes);
