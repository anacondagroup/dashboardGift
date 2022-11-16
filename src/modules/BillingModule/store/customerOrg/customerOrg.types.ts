import { IDeposit, IGroupInfo, ITeamInfo, TGroupId } from '../../types';

export interface IOrgInfo {
  id: number;
  name: string;
}

export interface ITeamsFilter {
  teamIds: number[];
  groupIds: string[];
}

export interface ICustomerStats {
  users: number;
  teams: number;
}

export type TGroupTeam = {
  teamInfo: ITeamInfo;
  deposits: IDeposit[];
};

export type TGroup = {
  groupInfo: IGroupInfo;
  deposits: IDeposit[];
  teams: TGroupTeam[];
};

export interface IOrgHierarchy {
  depositsTotal: IDeposit;
  remainingTeamsTotal: IDeposit;
  groupGrouped: TGroup[];
  ungrouped: TGroupTeam[];
}

export type TGroupTeamNode = {
  id: TGroupId | number;
  hierarchyId: string;
  name: string;
  deposit: IDeposit;
  balanceAccountId?: string;
  level: number;
  isUngrouped?: boolean;
};
