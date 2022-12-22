export interface ITeamAdmin {
  // eslint-disable-next-line camelcase
  full_name: string;
  email: string;
  avatar: string;
}

export enum TeamStatus {
  active = 'active',
  archived = 'archived',
}

export interface ITeam {
  id: number;
  name: string;
  admins: ITeamAdmin[];
  members: {
    amount: number;
  };
  group: {
    id: string;
    name: string;
  } | null;
  status: TeamStatus;
  archivedAt: {
    date: string;
    timezone: string;
  } | null;
}
