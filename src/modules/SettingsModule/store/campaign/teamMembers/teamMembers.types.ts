export interface ITeamMember {
  id: number;
  name: string;
}

export interface ITeamMembersResponse {
  // eslint-disable-next-line camelcase
  team_members: ITeamMember[];
}
