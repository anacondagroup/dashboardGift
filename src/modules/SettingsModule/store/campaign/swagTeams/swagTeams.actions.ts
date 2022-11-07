import { createAction } from 'redux-act';

import { ITeamMember } from './swagTeams.types';

const PREFIX = 'SETTINGS/CAMPAIGN/SWAG_TEAMS';

export const loadSwagTeamsRequest = createAction(`${PREFIX}/LOAD_REQUEST`);
export const loadSwagTeamsSuccess = createAction<{ teams: ITeamMember[] }>(`${PREFIX}/LOAD_SUCCESS`);
export const loadSwagTeamsFail = createAction(`${PREFIX}/LOAD_FAIL`);
