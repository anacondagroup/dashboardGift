export enum TeamField {
  Name = 'name',
  GroupId = 'groupId',
  GroupName = 'groupName',
}

export type TTeamFormParams = {
  [TeamField.Name]: string;
  [TeamField.GroupId]: string;
  [TeamField.GroupName]: string;
};
