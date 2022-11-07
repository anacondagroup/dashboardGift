import { createAction } from 'redux-act';

import { IPasswordForm } from './confirmation.types';

const PREFIX = 'CONFIRMATION';

export const setNewPasswordRequest = createAction<IPasswordForm>(`${PREFIX}/SET_NEW_PASSWORD_REQ`); // '*_REQ' to exclude this from token refresh by auth.middleware
export const setNewPasswordSuccess = createAction(`${PREFIX}/SET_NEW_PASSWORD_SUCCESS`);
export const setNewPasswordFail = createAction(`${PREFIX}/SET_NEW_PASSWORD_FAIL`);
