import { TBudgetUtilization } from '@alycecom/services';
import { IBudgetUtilizationByTeam } from '../store/budgetUtilization/budgetUtilization.types';

import { convertUtilizationsToDollars, getBudgetUtilizationText, hasBudgetToSpend } from './budget.helpers';

describe('toolbarUserBudget helpers', () => {
  describe('convertUtilizationToDollars', () => {
    it('returns the utilization with the money amounts converted to dollars', () => {
      const mockServerResponse: IBudgetUtilizationByTeam[] = [
        {
          teamId: 37,
          userId: 1045,
          budgetAmount: 150000,
          amountClaimed: 25000,
          amountSent: 350000,
          period: 'weekly',
        },
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 250000,
          amountClaimed: 35000,
          amountSent: 450000,
          period: 'weekly',
        },
      ];

      const result = convertUtilizationsToDollars(mockServerResponse);

      expect(result).toEqual([
        {
          teamId: 37,
          userId: 1045,
          budgetAmount: 1500,
          amountClaimed: 250,
          amountSent: 3500,
          period: 'weekly',
        },
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 2500,
          amountClaimed: 350,
          amountSent: 4500,
          period: 'weekly',
        },
      ]);
    });
  });

  describe('getBudgetUtilizationText', () => {
    it('returns the correct text when a utilization exists', () => {
      const utilization: TBudgetUtilization = {
        teamId: 37,
        userId: 1045,
        budgetAmount: 1500,
        availableBudgetAmount: 1250,
        pendingGiftAmount: 350,
        period: 'weekly',
        isActive: true,
      };

      const { availableBudget, pendingGiftCosts, allocatedBudget } = getBudgetUtilizationText(utilization);

      expect(availableBudget).toEqual('$ 1,250');

      expect(pendingGiftCosts).toEqual('$ 350');

      expect(allocatedBudget).toEqual('weekly / $ 1,500');
    });
  });

  describe('hasBudgetToSpend', () => {
    it('returns false when the use has no utilization defined', () => {
      const result = hasBudgetToSpend([]);
      expect(result).toEqual(false);
    });

    it('returns false when they have a budget utilizations but no available budgets', () => {
      const budgetUtilizations = [
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 0,
          availableBudgetAmount: 0,
          pendingGiftAmount: 0,
          period: 'monthly',
          isActive: true,
        },
        {
          teamId: 39,
          userId: 1045,
          budgetAmount: 0,
          availableBudgetAmount: 0,
          pendingGiftAmount: 0,
          period: 'weekly',
          isActive: true,
        },
      ];

      const result = hasBudgetToSpend(budgetUtilizations);
      expect(result).toEqual(false);
    });

    it('returns true if utilization has an available budget greater then zero', () => {
      const budgetUtilizations = [
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 100,
          availableBudgetAmount: 0,
          pendingGiftAmount: 0,
          period: 'monthly',
          isActive: true,
        },
      ];

      const result = hasBudgetToSpend(budgetUtilizations);
      expect(result).toEqual(true);
    });

    it('still returns true if some teams utilizations have available budget but others do not', () => {
      const budgetUtilizations = [
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 0,
          availableBudgetAmount: 0,
          pendingGiftAmount: 0,
          period: 'monthly',
          isActive: true,
        },
        {
          teamId: 38,
          userId: 1045,
          budgetAmount: 100,
          availableBudgetAmount: 0,
          pendingGiftAmount: 0,
          period: 'monthly',
          isActive: true,
        },
      ];

      const result = hasBudgetToSpend(budgetUtilizations);
      expect(result).toEqual(true);
    });
  });
});
