export interface IBudgetUtilizationByTeam {
  userId: number;
  teamId: number;
  budgetAmount: number;
  amountClaimed: number;
  amountSent: number;
  period: string;
}
