import { createSelector } from 'reselect';
import { appApi, TOrganizationBillingHierarchyState, GroupsTeamsIdentifier } from '@alycecom/services';

import { getSelectedHierarchyId } from './ui/transactionsFilters/transactionsFilters.selectors';
import { AllGroupsAndTeamsOption, UngroupedTeamsOption } from './customerOrg/customerOrg.constants';
import { makeGroupHierarchyId, makeTeamHierarchyId } from './ui/transactionsFilters/transactionsFilters.helpers';
import { TGroupNode, TGroupTeamNode } from './billing.types';

const emptyHierarchyState: TOrganizationBillingHierarchyState = {
  depositsTotal: {
    accountId: AllGroupsAndTeamsOption.accountId,
    money: {
      amount: 0,
    },
  },
  remainingTeamsTotal: {
    accountId: UngroupedTeamsOption.accountId,
    money: {
      amount: 0,
    },
  },
  groupGrouped: [],
  ungrouped: [],
};

export const getHierarchyList = createSelector(
  appApi.endpoints.getOrganizationBillingHierarchy.select(),
  ({ data }) => {
    const hierarchy = data ?? emptyHierarchyState;

    const hierarchyList: TGroupTeamNode[] = [
      {
        ...AllGroupsAndTeamsOption,
        hierarchyId: makeGroupHierarchyId(GroupsTeamsIdentifier.AllGroupsAndTeams),
        deposit: hierarchy.depositsTotal,
        level: 0,
      },
    ];
    hierarchyList.push(
      ...hierarchy.groupGrouped.reduce<TGroupTeamNode[]>((acc: TGroupTeamNode[], group) => {
        acc.push({
          id: group.groupInfo.groupId,
          hierarchyId: makeGroupHierarchyId(group.groupInfo.groupId),
          name: group.groupInfo.groupName,
          deposit: group.deposits[0],
          level: 0,
        });
        acc.push(
          ...group.teams.map(team => ({
            id: team.teamInfo.teamId,
            hierarchyId: makeTeamHierarchyId(String(team.teamInfo.teamId)),
            name: team.teamInfo.teamName,
            deposit: team.deposits[0],
            balanceAccountId: group.deposits[0]?.accountId,
            level: 1,
          })),
        );
        return acc;
      }, []),
    );

    if (hierarchy.ungrouped.length > 0) {
      hierarchyList.push(
        {
          ...UngroupedTeamsOption,
          hierarchyId: makeGroupHierarchyId(GroupsTeamsIdentifier.Ungrouped),
          deposit: hierarchy.remainingTeamsTotal,
          level: 0,
        },
        ...hierarchy.ungrouped.map(team => ({
          id: team.teamInfo.teamId,
          hierarchyId: `team-${team.teamInfo.teamId}`,
          name: team.teamInfo.teamName,
          deposit: team.deposits[0],
          isUngrouped: true,
          level: 1,
        })),
      );
    }

    return hierarchyList;
  },
);

export const getSelectedGroupOrTeam = createSelector(
  getHierarchyList,
  getSelectedHierarchyId,
  (items, selectedId) => items.find(item => item.hierarchyId === selectedId) ?? items[0],
);

export const getGroupsMap = createSelector(appApi.endpoints.getOrganizationBillingHierarchy.select(), ({ data }) => {
  const hierarchy = data ?? emptyHierarchyState;

  const groupsMap = hierarchy.groupGrouped.reduce(
    (map, group) => ({
      ...map,
      [group.groupInfo.groupId]: { ...group.groupInfo, deposit: group.deposits[0], teams: group.teams },
    }),
    {} as Record<string, TGroupNode>,
  );

  groupsMap[AllGroupsAndTeamsOption.id] = {
    groupId: AllGroupsAndTeamsOption.id,
    groupName: AllGroupsAndTeamsOption.name,
    deposit: hierarchy.depositsTotal,
    teams: [],
  };

  if (hierarchy.ungrouped.length > 0) {
    groupsMap[UngroupedTeamsOption.id] = {
      groupId: UngroupedTeamsOption.id,
      groupName: UngroupedTeamsOption.name,
      deposit: hierarchy.remainingTeamsTotal,
      teams: hierarchy.ungrouped,
    };
  }

  return groupsMap;
});
