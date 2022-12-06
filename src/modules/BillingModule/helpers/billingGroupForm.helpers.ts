import { TGiftingActivityGroup, TGiftingActivityTeam } from '@alycecom/services';
import { Dictionary } from '@reduxjs/toolkit';

import { IBillingContact } from '../store/billingGroupsContacts/billingGroupsContacts.types';
import { TGiftingActivityGroupNode } from '../types';
import { GroupsTeamsConstants } from '../constants/groupsTeams.constants';
import { UngroupedTeamsOption } from '../store/customerOrg/customerOrg.constants';

export const getBillingGroupContactOptionLabel = (option: IBillingContact): string => {
  if (option.email) {
    return option.firstName || option.lastName
      ? `${option.firstName} ${option.lastName} (${option.email})`
      : option.email;
  }
  return '';
};

export const getBillingGroupContactOptionSelected = (option: IBillingContact, optionValue: IBillingContact): boolean =>
  option.email === optionValue?.email;

const calculateAmount = (field: keyof Omit<TGiftingActivityTeam, 'teamId' | 'teamName'>) => (
  teams: TGiftingActivityTeam[],
): number => teams.reduce((acc, team) => acc + team[field], 0);

export const transformGiftingActivityGroupsToMap = (
  entities: Dictionary<TGiftingActivityGroup>,
): Dictionary<TGiftingActivityGroupNode> => {
  const groups = Object.values(entities) as TGiftingActivityGroup[];

  return groups.reduce((acc, group) => {
    const isUngrouped = group.groupId === GroupsTeamsConstants.Ungrouped;
    return {
      ...acc,
      [group.groupId]: {
        ...group,
        groupName: isUngrouped ? UngroupedTeamsOption.name : group.groupName,
        sentCount: calculateAmount('sentCount')(group.teams),
        claimedCount: calculateAmount('claimedCount')(group.teams),
        purchasedCount: calculateAmount('purchasedCount')(group.teams),
        amountAtTheStart: isUngrouped ? calculateAmount('amountAtTheStart')(group.teams) : group.amountAtTheStart,
        amountAtTheEnd: isUngrouped ? calculateAmount('amountAtTheEnd')(group.teams) : group.amountAtTheEnd,
        amountSpent: isUngrouped ? calculateAmount('amountSpent')(group.teams) : group.amountSpent,
        teams: group.teams.map(team => ({ ...team, isUngrouped })),
      },
    };
  }, {});
};
