import { createAction } from 'redux-act';

import { IEmailType } from './emailTypes.types';

const PREFIX = 'EMAIL_BRANDING/EMAIL_TYPES';

export const loadEmailTypesRequest = createAction(`${PREFIX}/LOAD_EMAIL_TYPES_REQUEST`);
export const loadEmailTypesSuccess = createAction<IEmailType[]>(`${PREFIX}/LOAD_EMAIL_TYPES_SUCCESS`);
export const loadEmailTypesFail = createAction(`${PREFIX}/LOAD_EMAIL_TYPES_FAIL`);

export const resetEmailTypes = createAction(`${PREFIX}/RESET_EMAIL_TYPES`);
