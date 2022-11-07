import { createAction } from 'redux-act';

import { IEloquaIntegration } from './eloqua.types';

const PREFIX = 'INTEGRATIONS_ELOQUA_INFO';

export const organisationEloquaIntegrationInfoCheckRequest = createAction(`${PREFIX}_REQUEST`);
export const organisationEloquaIntegrationInfoCheckSuccess = createAction<IEloquaIntegration>(`${PREFIX}_SUCCESS`);
export const organisationEloquaIntegrationInfoCheckFail = createAction(`${PREFIX}_FAIL`);
