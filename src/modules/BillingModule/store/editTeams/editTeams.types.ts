export interface ITeamsListSearchDetails {
  orgId: number;
  groupId: string | null;
  teamId: number;
  teamName: string;
  teamOwnerId: number;
  groupName?: string;
  chose: boolean;
  disabled: boolean;
}
