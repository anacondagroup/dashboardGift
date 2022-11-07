import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IUser } from './managers.types';

const PREFIX = 'TEAM_SETTINGS/MANAGERS';

export const loadManagersRequest = createAction<{ teamId: number }>(`${PREFIX}/LOAD_MANAGERS_REQUEST`);
export const loadManagersSuccess = createAction<{ managers: IUser[] }>(`${PREFIX}/LOAD_MANAGERS_SUCCESS`);
export const loadManagersFail = createAction<TErrors>(`${PREFIX}/LOAD_MANAGERS_FAIL`);
