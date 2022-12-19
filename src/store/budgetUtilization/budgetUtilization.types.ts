import { PauseGiftingOnOption } from '@alycecom/services';

export interface IBudgetUtilizationByTeam {
  userId: number;
  teamId: number;
  budgetAmount: number;
  amountClaimed: number;
  amountSent: number;
  period: string;
  pauseGiftingOn: PauseGiftingOnOption;
}

export enum BudgetBulkEditOption {
  GiftBudget = 'Gift budget',
  AddOneOff = 'Add one-off',
}
