import { createAction } from 'redux-act';

import { ITeam } from './teams.types';

const PREFIX = 'DASHBOARD/TEAMS';

export const loadTeamsRequest = createAction(`${PREFIX}/LOAD_TEAMS_REQUEST`);
export const loadTeamsSuccess = createAction<ITeam[]>(`${PREFIX}/LOAD_TEAMS_SUCCESS`);
export const loadTeamsFail = createAction(`${PREFIX}/LOAD_TEAMS_FAIL`);
