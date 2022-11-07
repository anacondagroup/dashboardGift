export interface ITeamAdmin {
  // eslint-disable-next-line camelcase
  full_name: string;
  email: string;
  avatar: string;
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
}
