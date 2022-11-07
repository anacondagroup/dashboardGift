import { TBudgetUtilization } from '@alycecom/services';
import numeral from 'numeral';
import { isEmpty } from 'ramda';

import { IBudgetUtilizationByTeam } from '../store/budgetUtilization/budgetUtilization.types';

export function convertUtilizationsToDollars(
  budgetUtilizations: IBudgetUtilizationByTeam[],
): IBudgetUtilizationByTeam[] {
  return budgetUtilizations.map(budgetUtilization => ({
    ...budgetUtilization,
    budgetAmount: budgetUtilization.budgetAmount / 100,
    amountClaimed: budgetUtilization.amountClaimed / 100,
    amountSent: budgetUtilization.amountSent / 100,
  }));
}

const NO_BUDGET_FALLBACK_TEXT = '$--';

interface IBudgetUtilizationText {
  availableBudget: string;
  pendingGiftCosts: string;
  allocatedBudget: string;
}

export function formatBudgetUtilizationAmount(amount: number): string {
  return numeral(amount).format('$ 0,0[.]00');
}

export function getBudgetUtilizationText(budgetUtilization: TBudgetUtilization | undefined): IBudgetUtilizationText {
  if (budgetUtilization) {
    return {
      availableBudget: formatBudgetUtilizationAmount(budgetUtilization.availableBudgetAmount),
      pendingGiftCosts: formatBudgetUtilizationAmount(budgetUtilization.pendingGiftAmount),
      allocatedBudget: `${budgetUtilization.period} / ${formatBudgetUtilizationAmount(budgetUtilization.budgetAmount)}`,
    };
  }

  return {
    availableBudget: NO_BUDGET_FALLBACK_TEXT,
    pendingGiftCosts: NO_BUDGET_FALLBACK_TEXT,
    allocatedBudget: `no reset / ${NO_BUDGET_FALLBACK_TEXT}`,
  };
}

export function hasBudgetToSpend(budgetUtilizations: TBudgetUtilization[]): boolean {
  // Case where not budget has been defined
  if (isEmpty(budgetUtilizations)) return false;

  return budgetUtilizations.reduce((prev, curr) => prev + curr.budgetAmount, 0) > 0;
}
