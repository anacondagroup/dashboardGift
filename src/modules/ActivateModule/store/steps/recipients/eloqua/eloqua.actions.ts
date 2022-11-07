import { createAction } from 'redux-act';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/ELOQUA';

export const saveEloquaSourceTypeRequest = createAction(`${PREFIX}/SET_SOURCE_TYPE_REQUEST`);
export const saveEloquaSourceTypeSuccess = createAction(`${PREFIX}/SET_SOURCE_TYPE_SUCCESS`);
export const saveEloquaSourceTypeFail = createAction(`${PREFIX}/SET_SOURCE_TYPE_FAIL`);
