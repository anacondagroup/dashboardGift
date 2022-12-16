import { TGiftingActivityGroup, TGiftingActivityTeam } from '@alycecom/services';

export type TGiftingActivityTeamNode = TGiftingActivityTeam & { isUngrouped?: boolean };

export type TGiftingActivityGroupNode = TGiftingActivityGroup & {
  sentCount: number;
  claimedCount: number;
  purchasedCount: number;
  teams: TGiftingActivityTeamNode[];
};

export type TSortingColumn =
  | keyof Pick<
      TGiftingActivityGroupNode,
      'groupName' | 'sentCount' | 'claimedCount' | 'purchasedCount' | 'amountSpent' | 'amountAtTheEnd'
    >
  | keyof Pick<TGiftingActivityTeam, 'teamName'>;
