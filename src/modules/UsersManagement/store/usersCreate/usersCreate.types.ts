import { ITeamExtraData, UserRoles } from '../usersManagement.types';

export interface IUserAssignParams {
  role: UserRoles;
  teams: ITeamExtraData[];
}

export interface ICreateUsersParams {
  role: UserRoles;
  teamIds: number[];
}

export enum UsersCreateFieldName {
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  company = 'company',
}

export type TUserCreateParams = {
  [UsersCreateFieldName.email]: string;
  [UsersCreateFieldName.firstName]: string;
  [UsersCreateFieldName.lastName]: string;
  [UsersCreateFieldName.company]: string;
};
