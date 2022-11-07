import { createAction } from 'redux-act';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/HUBSPOT';

export const saveHubSpotSourceTypeRequest = createAction(`${PREFIX}/SET_SOURCE_TYPE_REQUEST`);
export const saveHubSpotSourceTypeSuccess = createAction(`${PREFIX}/SET_SOURCE_TYPE_SUCCESS`);
export const saveHubSpotSourceTypeFail = createAction(`${PREFIX}/SET_SOURCE_TYPE_FAIL`);
