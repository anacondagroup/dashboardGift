import { TErrors } from '@alycecom/services';
import { createReducer } from 'redux-act';

import { IUser } from '../../../../UsersManagement/store/usersManagement.types';
import { ITeam } from '../teams/teams.types';

import { TeamSidebarStep } from './teamOperation.types';
import { setTeamMembersBudgetTable, setTeamSidebarStep } from './teamOperation.actions';

export type TTeamOperationState = {
  prevTeamSidebarStep: TeamSidebarStep | null;
  teamSidebarStep: TeamSidebarStep | null;
  teamId?: number;
  errors: TErrors;
  teamMembersBudgetTable: TTeamMembersBudgetTable;
  team?: ITeam;
};

export type TTeamMembersBudgetTable = {
  users: IUser[];
  pagination: number;
};

export const initialTeamOperationState: TTeamOperationState = {
  prevTeamSidebarStep: null,
  teamSidebarStep: null,
  errors: {},
  teamMembersBudgetTable: {
    users: [],
    pagination: 1,
  },
};

export const teamOperation = createReducer({}, initialTeamOperationState);

teamOperation.on(setTeamSidebarStep, (state, payload) => ({
  ...state,
  prevTeamSidebarStep: payload.step ? state.teamSidebarStep : null,
  teamSidebarStep: payload.step,
  teamId: payload.teamId,
  team: payload.team,
}));

teamOperation.on(setTeamMembersBudgetTable, (state, payload) => ({
  ...state,
  teamMembersBudgetTable: payload,
}));
