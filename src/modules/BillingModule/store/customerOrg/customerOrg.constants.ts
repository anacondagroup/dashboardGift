import { GroupsTeamsIdentifier } from '@alycecom/services';

export const AllGroupsAndTeamsOption = {
  id: GroupsTeamsIdentifier.AllGroupsAndTeams,
  name: 'All Groups',
  accountId: '0',
};

export const UngroupedTeamsOption = {
  id: GroupsTeamsIdentifier.Ungrouped,
  name: 'Remaining Teams',
  accountId: 'ungrouped',
};
