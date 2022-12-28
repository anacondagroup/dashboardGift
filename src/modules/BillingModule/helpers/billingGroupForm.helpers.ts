import { TGiftingActivityGroup, TGiftingActivityTeam, GroupsTeamsIdentifier } from '@alycecom/services';
import { SortDirection } from '@alycecom/utils';
import { ascend, descend, sort, path, curry } from 'ramda';

import { IBillingContact } from '../store/billingGroupsContacts/billingGroupsContacts.types';
import { TGiftingActivityGroupNode, TSortingColumn } from '../types';
import { UngroupedTeamsOption } from '../store/customerOrg/customerOrg.constants';
import { TSorting } from '../store/ui/overviewFilters/overviewFilters.types';

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

const calculateAmount = (teams: TGiftingActivityTeam[]) => (
  field: keyof Omit<TGiftingActivityTeam, 'teamId' | 'teamName' | 'archivedAt'>,
): number => teams.reduce((acc, team) => acc + team[field], 0);

export const transformGiftingActivityGroups = (groups: TGiftingActivityGroup[]): TGiftingActivityGroupNode[] =>
  groups.map(group => {
    const isUngrouped = group.groupId === GroupsTeamsIdentifier.Ungrouped;
    const calculateByField = curry(calculateAmount)(group.teams);
    return {
      ...group,
      groupName: isUngrouped ? UngroupedTeamsOption.name : group.groupName,
      sentCount: calculateByField('sentCount'),
      claimedCount: calculateByField('claimedCount'),
      purchasedCount: calculateByField('purchasedCount'),
      amountAtTheStart: isUngrouped ? calculateByField('amountAtTheStart') : group.amountAtTheStart,
      amountAtTheEnd: isUngrouped ? calculateByField('amountAtTheEnd') : group.amountAtTheEnd,
      amountSpent: isUngrouped ? calculateByField('amountSpent') : group.amountSpent,
      teams: group.teams.map(team => ({ ...team, isUngrouped })),
    };
  });

export const makeSortByColumn = <Item>(sorting: TSorting<TSortingColumn> | null): ((items: Item[]) => Item[]) => {
  const direction = sorting?.direction === SortDirection.asc ? ascend : descend;
  return sort(direction(path((sorting?.column ?? '').split('.'))));
};
