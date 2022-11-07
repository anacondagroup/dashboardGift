import { createAction } from 'redux-act';

import { IPurposesOptionsResponse } from './purposes.types';

const PREFIX = 'SETTINGS/CAMPAIGN/GENERAL';

export const loadPurposesRequest = createAction(`${PREFIX}/LOAD_PURPOSES_REQUEST`);
export const loadPurposesSuccess = createAction<IPurposesOptionsResponse>(`${PREFIX}/LOAD_PURPOSES_SUCCESS`);
export const loadPurposesFail = createAction(`${PREFIX}/LOAD_PURPOSES_FAIL`);
