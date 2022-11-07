import { createAction } from 'redux-act';

import { ITeamMember } from './teamMembers.types';

const PREFIX = 'SETTINGS/CAMPAIGN/GENERAL';

export const loadTeamMembersRequest = createAction<{ campaignId: number }>(`${PREFIX}/LOAD_TEAM_MEMBERS_REQUEST`);
export const loadTeamMembersSuccess = createAction<{ members: ITeamMember[] }>(`${PREFIX}/LOAD_TEAM_MEMBERS_SUCCESS`);
export const loadTeamMembersFail = createAction(`${PREFIX}/LOAD_TEAM_MEMBERS_FAIL`);

export const loadTeamAdminsRequest = createAction<{ campaignId: number }>(`${PREFIX}/LOAD_ADMINS_REQUEST`);
export const loadTeamAdminsSuccess = createAction<{ admins: ITeamMember[] }>(`${PREFIX}/LOAD_ADMINS_SUCCESS`);
export const loadTeamAdminsFail = createAction(`${PREFIX}/LOAD_ADMINS_FAIL`);

export const clearData = createAction(`${PREFIX}/CLEAR_DATA`);
