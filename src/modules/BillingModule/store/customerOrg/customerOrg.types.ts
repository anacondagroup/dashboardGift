import { IDeposit, IGroupInfo, ITeamInfo } from '../../types';

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

export interface IOrgHierarchy {
  depositsTotal: IDeposit;
  remainingTeamsTotal: IDeposit;
  groupGrouped: {
    groupInfo: IGroupInfo;
    deposits: IDeposit[];
    teams: {
      teamInfo: ITeamInfo;
      deposits: IDeposit[];
    }[];
  }[];
  ungrouped: {
    teamInfo: ITeamInfo;
    deposits: IDeposit[];
  }[];
}

export interface ISelectedAccount {
  id: string | number;
  name: string;
  accountId: string;
  level: number | null;
}
