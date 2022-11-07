import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IActivateMessaging } from './messaging.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/MESSAGING';

export const messagingStepRequest = createAction<{
  data: IActivateMessaging;
  options?: { openLinkOnSuccess?: string };
}>(`${PREFIX}/UPDATE_REQUEST`, payload => payload);

export const messagingStepSuccess = createAction<IActivateMessaging>(`${PREFIX}/UPDATE_SUCCESS`);
export const messagingStepFail = createAction<TErrors>(`${PREFIX}/UPDATE_FAIL`);
