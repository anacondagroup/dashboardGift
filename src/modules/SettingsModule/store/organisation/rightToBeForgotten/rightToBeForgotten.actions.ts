import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { TForgottenRequestData, TForgottenRequestErrors } from './rightToBeForgotten.types';

const prefix = 'ORG_SETTINGS/RIGHT_TO_BE_FORGOTTEN';

export const sendRightToBeForgotten = createAction<TForgottenRequestData>(`${prefix}/SEND_TO_BE_FORGOTTEN_REQUEST`);
export const sendRightToBeForgottenSuccess = createAction<void>(`${prefix}/SEND_TO_BE_FORGOTTEN_SUCCESS`);
export const sendRightToBeForgottenFail = createAction<TErrors<TForgottenRequestErrors>>(
  `${prefix}/SEND_TO_BE_FORGOTTEN_FAIL`,
);
