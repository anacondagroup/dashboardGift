import { pipe } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';
import { GroupsTeamsConstants } from '../../constants/groupsTeams.constants';
import { TGroupId } from '../../types';

import { AllGroupsAndTeamsOption, UngroupedTeamsOption } from './customerOrg.constants';
import { TGroupNode, TGroupTeamNode } from './customerOrg.types';
import { makeGroupHierarchyId, makeTeamHierarchyId } from './customerOrg.helpers';

const getCustomerOrgState = (state: IRootState) => state.billing.customerOrg;

export const getOrg = pipe(getCustomerOrgState, state => state.org);
export const getOrgTeams = pipe(getCustomerOrgState, state => state.teams.list);
export const getOrgGroups = pipe(getCustomerOrgState, state => state.groups.list);

export const getTeamsFilter = pipe(getCustomerOrgState, state => state.teamsFilter);
export const getSelectedGroup = pipe(getCustomerOrgState, state => state.selectedGroup);

export const getStats = pipe(getCustomerOrgState, state => state.stats);
export const getResources = pipe(getCustomerOrgState, state => state.resources);

export const getHierarchy = pipe(getCustomerOrgState, state => state.hierarchy.data);
export const getHierarchyIsLoading = pipe(getCustomerOrgState, state => state.hierarchy.status === StateStatus.Pending);
export const getHierarchyIsLoaded = pipe(
  getCustomerOrgState,
  state => state.hierarchy.status === StateStatus.Fulfilled,
);
export const getSelectedGroupOrTeamId = pipe(getCustomerOrgState, state => state.hierarchy.selectedHierarchyId);

export const getHierarchyList = createSelector(getHierarchy, hierarchy => {
  const hierarchyList: TGroupTeamNode[] = [
    {
      ...AllGroupsAndTeamsOption,
      hierarchyId: makeGroupHierarchyId(GroupsTeamsConstants.AllGroupsAndTeams),
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
        hierarchyId: makeGroupHierarchyId(GroupsTeamsConstants.Ungrouped),
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
});

export const getSelectedGroupOrTeam = createSelector(
  getHierarchyList,
  getSelectedGroupOrTeamId,
  (items, selectedId) => items.find(item => item.hierarchyId === selectedId) ?? items[0],
);

export const getGroupsMap = createSelector(getHierarchy, hierarchy => {
  const groupsMap = hierarchy.groupGrouped.reduce(
    (map, group) => ({
      ...map,
      [group.groupInfo.groupId]: { ...group.groupInfo, deposit: group.deposits[0], teams: group.teams },
    }),
    {} as Record<TGroupId, TGroupNode>,
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
