import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ITeamExtraData } from '../../usersManagement.types';

const PREFIX = 'USERS_MANAGEMENT/TEAMS';

export const loadTeamsRequest = createAction<void>(`${PREFIX}/LOAD_TEAMS_REQUEST`);
export const loadTeamsSuccess = createAction<ITeamExtraData[]>(`${PREFIX}/LOAD_TEAMS_SUCCESS`);
export const loadTeamsFail = createAction<TErrors>(`${PREFIX}/LOAD_TEAMS_FAIL`);
