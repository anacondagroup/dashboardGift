import { TDeposit, TGroupTeam } from '@alycecom/services';

export type TDateRange = {
  preset?: string;
  from?: string;
  to?: string;
};

export type TGroupTeamNode = {
  id: string | number;
  hierarchyId: string;
  name: string;
  deposit: TDeposit;
  balanceAccountId?: string;
  level: number;
  isUngrouped?: boolean;
};

export type TGroupNode = {
  groupId: string;
  groupName: string;
  deposit: TDeposit;
  teams: TGroupTeam[];
};
