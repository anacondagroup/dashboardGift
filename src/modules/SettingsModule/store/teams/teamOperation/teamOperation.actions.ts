import { createAction } from 'redux-act';

import { IUser } from '../../../../UsersManagement/store/usersManagement.types';
import { ITeam } from '../teams/teams.types';

import { TeamSidebarStep } from './teamOperation.types';

const PREFIX = 'TEAM_MANAGEMENT/TEAM_OPERATION';

export const setTeamSidebarStep = createAction<{ step: TeamSidebarStep | null; teamId?: number; team?: ITeam }>(
  `${PREFIX}/SET_TEAM_SIDEBAR_STEP`,
);

export const setTeamMembersBudgetTable = createAction<{
  users: IUser[];
  pagination: number;
}>(`${PREFIX}/SET_TEAM_MEMBERS_BUDGET_TABLE`);
