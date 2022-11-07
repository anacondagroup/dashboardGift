import { createAction } from 'redux-act';

import { ITeamMember } from './swagTeamAdmins.types';

const PREFIX = 'SETTINGS/CAMPAIGN/SWAG_TEAM_ADMINS';

export const loadSwagTeamAdminsRequest = createAction<{ teamId: number }>(`${PREFIX}/LOAD_REQUEST`);
export const loadSwagTeamAdminsSuccess = createAction<{ admins: ITeamMember[] }>(`${PREFIX}/LOAD_SUCCESS`);
export const loadSwagTeamAdminsFail = createAction(`${PREFIX}/LOAD_FAIL`);
