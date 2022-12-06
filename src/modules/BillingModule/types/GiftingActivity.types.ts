import { TGiftingActivityGroup, TGiftingActivityTeam } from '@alycecom/services';

export type TGiftingActivityTeamNode = TGiftingActivityTeam & { isUngrouped?: boolean };

export type TGiftingActivityGroupNode = TGiftingActivityGroup & {
  sentCount: number;
  claimedCount: number;
  purchasedCount: number;
  amountSpent: number;
};
