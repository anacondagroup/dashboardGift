export interface IBillingGroupsPayload {
  data: IGroupsDetailsComplete[];
  pagination: IPagination;
}

export interface ITeamsPayload {
  groupIds: string | null;
  data: ITeamDetail[];
  pagination: IPagination;
}

export interface IBillingGroupsInfo {
  billingGroups: IBillingGroup[];
  pagination: IPagination;
}

export interface IBillingGroup {
  billingInfo: IGroupsDetailsComplete;
  teams: ITeamDetail[];
  teamsLoaded: boolean;
  isExpanded: boolean;
  isLoadingTeams: boolean;
}

export interface IGroupsDetailsComplete {
  orgId: number;
  groupId: string | null;
  groupName: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  emailsCc?: string[];
  poNumber: string | null;
  teamsCount?: number | null;
}

export interface ITeamDetail {
  orgId: number;
  groupId: string | null;
  teamId: number;
  teamName: string;
  archivedAt: string | null;
  teamOwnerId: number;
  totalUsers: number;
  totalActiveCampaigns: number;
}

export interface IPagination {
  currentPage: number;
  perPage: number;
  total: number;
}

export interface IGroupId {
  groupId: string;
}

export interface ISearchGroupResultsPayload {
  data: IGroupId[];
  pagination: IPagination;
}
