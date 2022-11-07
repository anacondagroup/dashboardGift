import { IAccountResources } from './AccountResources.types';

export interface ITeamInfo {
  teamId: number;
  teamName: string;
  groupId?: string;
}

export interface ITeam extends ITeamInfo {
  resources: IAccountResources;
  totalInvites: number;
  totalMoney: number;
}
