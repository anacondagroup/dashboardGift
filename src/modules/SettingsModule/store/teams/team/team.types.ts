export enum TeamField {
  Name = 'name',
  GroupId = 'groupId',
}

export type TTeamFormParams = {
  [TeamField.Name]: string;
  [TeamField.GroupId]: string;
};
