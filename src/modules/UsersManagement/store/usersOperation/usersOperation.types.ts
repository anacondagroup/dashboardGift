import { ITeamExtraData } from '../usersManagement.types';

export enum UsersSidebarStep {
  userInfo,
  assignRoles,
  editUser,
  chooseFile,
  importedUsersInfo,
}

export interface IUserAssignTeamsParams {
  teams: ITeamExtraData[];
}
