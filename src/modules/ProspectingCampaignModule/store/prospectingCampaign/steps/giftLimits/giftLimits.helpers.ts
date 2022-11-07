import { ITeamMember } from '@alycecom/modules';
import { indexBy } from 'ramda';
import { SortDirectionType, SortDirection } from 'react-virtualized';

import {
  GiftLimitMemberField,
  GiftLimitPeriod,
  TProspectingCampaignMember,
  TGiftLimitsFilters,
} from './giftLimits.types';

export const transformNullableNumberValue = {
  output: (value: number | null): string => String(value ?? ''),
  input: (value: string): number | null => (value === '' ? null : Number(value) ?? null),
} as const;

export const combineTeamMembersWithGiftLimits = (
  teamMembers: ITeamMember[],
  giftLimits: TProspectingCampaignMember[],
): TProspectingCampaignMember[] => {
  const giftLimitsGroup = indexBy<TProspectingCampaignMember>(user => user.userId as string, giftLimits);

  return teamMembers.map(teamMember => ({
    userId: teamMember.id,
    limit: giftLimitsGroup[teamMember.id]?.limit ?? null,
    period: giftLimitsGroup[teamMember.id]?.period ?? null,
    remaining: giftLimitsGroup[teamMember.id]?.remaining ?? null,
  }));
};

const PERIOD_BY_PRIORITY = {
  [GiftLimitPeriod.Day]: 1,
  [GiftLimitPeriod.Week]: 2,
  [GiftLimitPeriod.Month]: 3,
  [GiftLimitPeriod.Quarter]: 4,
  [GiftLimitPeriod.Infinite]: 10,
  unknown: 0,
};

const compareNumericValues = (a: number, b: number, dir: SortDirectionType) =>
  (a - b) * (dir === SortDirection.DESC ? -1 : 1);
const compareTextValues = (a: string, b: string, dir: SortDirectionType) =>
  a.localeCompare(b) * (dir === SortDirection.DESC ? -1 : 1);

export const filterTeamMembersByFullNameAndEmail = (search: string, teamMembers: ITeamMember[]): ITeamMember[] => {
  if (search.trim() === '') return teamMembers;

  return teamMembers.filter(teamMember =>
    `${teamMember.firstName} ${teamMember.lastName} ${teamMember.email}`.toLowerCase().includes(search.toLowerCase()),
  );
};

export const sortTeamMembersByName = ({ dir }: { dir: SortDirectionType }, teamMembers: ITeamMember[]): ITeamMember[] =>
  teamMembers.sort((memberA, memberB) =>
    compareTextValues(`${memberA.firstName} ${memberA.lastName}`, `${memberB.firstName} ${memberB.lastName}`, dir),
  );

export const sortGiftLimitsByNumericField = (
  {
    by,
    dir,
  }: {
    by: GiftLimitMemberField.Limit | GiftLimitMemberField.Remaining;
    dir: SortDirectionType;
  },
  giftLimits: TProspectingCampaignMember[],
): TProspectingCampaignMember[] =>
  giftLimits.sort((limitA, limitB) => compareNumericValues(limitA[by] ?? -1, limitB[by] ?? -1, dir));

export const sortGiftLimitsByPeriodField = (
  { dir }: { dir: SortDirectionType },
  giftLimits: TProspectingCampaignMember[],
): TProspectingCampaignMember[] =>
  giftLimits.sort((limitA, limitB) =>
    compareNumericValues(
      PERIOD_BY_PRIORITY[limitA[GiftLimitMemberField.Period] ?? 'unknown'],
      PERIOD_BY_PRIORITY[limitB[GiftLimitMemberField.Period] ?? 'unknown'],
      dir,
    ),
  );

export const combineAndFilterTeamMembersWithGiftLimits = (
  { search, sort: { by, dir = SortDirection.ASC } }: TGiftLimitsFilters,
  teamMembers: ITeamMember[],
  giftLimits: TProspectingCampaignMember[],
): TProspectingCampaignMember[] => {
  const searchedTeamMembers = filterTeamMembersByFullNameAndEmail(search, teamMembers);

  if (by === 'firstName' && dir) {
    const sortedTeamMembers = sortTeamMembersByName({ dir }, searchedTeamMembers);
    return combineTeamMembersWithGiftLimits(sortedTeamMembers, giftLimits);
  }
  const combinedGiftLimits = combineTeamMembersWithGiftLimits(searchedTeamMembers, giftLimits);

  switch (by) {
    case GiftLimitMemberField.Remaining:
    case GiftLimitMemberField.Limit: {
      return sortGiftLimitsByNumericField({ by, dir }, combinedGiftLimits);
    }
    case GiftLimitMemberField.Period: {
      return sortGiftLimitsByPeriodField({ dir }, combinedGiftLimits);
    }
    default: {
      return combinedGiftLimits;
    }
  }
};
