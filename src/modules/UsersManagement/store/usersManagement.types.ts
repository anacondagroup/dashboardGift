import { IntegrationName } from '../constants/integrations.constants';
import { TABLE_SORT } from '../../../components/Shared/CustomTable/customTable.constants';

export interface IOffsetPagination {
  total: number;
  limit: number;
  offset: number;
}

export interface IUserTeam {
  id: number;
  name: string;
  access: UserRoles;
  isLastAdmin: boolean;
  belongsToTeam: boolean;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  integration: IntegrationName | null;
  lastActivity: string | null;
  teams: IUserTeam[];
  imageUrl?: string;
  isLastAdmin: boolean;
}

export interface IRequestUsersParams {
  search?: string;
  teamId: number | null;
  pendingInvitation: boolean;
  sortField?: string;
  sortDirection?: TABLE_SORT;
  currentPage: number;
  limit: number;
  isAllSelected?: boolean;
}

export interface IRequestUser extends IRequestUsersParams {
  isTeamMembersBudget?: boolean;
  isLoadMore?: boolean;
}

export enum UserRoles {
  member = 'member',
  admin = 'admin',
}

export interface IUpsertUsersParams {
  role: UserRoles;
  teamIds: number[];
}

export interface ITeam {
  id: number;
  name: string;
}

export interface ITeamExtraData extends ITeam {
  archivedAt: null;
  belongsToTeam?: boolean;
}

export interface IUsersMeta {
  pendingInvitationUsers: number[];
}
