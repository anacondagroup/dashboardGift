import { ITeam } from './Team.types';

export type TGroupId = string | 'Ungrouped';

export interface IGroupInfo {
  groupId: TGroupId;
  groupName: string;
}

export interface IGroup extends IGroupInfo {
  teams: ITeam[];
  totalInvites: number;
  totalMoney: number;
}
