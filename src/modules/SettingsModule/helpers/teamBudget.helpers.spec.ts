import { PauseGiftingOnOption } from '@alycecom/services';

import { IBudget, RefreshPeriod } from '../store/teams/budgets/budgets.types';
import { convertBudgetToDollars } from './teamBudget.helpers';

describe('teamBudget helpers', () => {
  describe('convertBudgetToDollars', () => {
    const budgetInCents: IBudget = {
      teamId: 37,
      teamMembers: [
        { userId: 1045, budget: 10000 },
        { userId: 1046, budget: 10012 },
        { userId: 1047, budget: 10020 },
      ],
      pauseGiftingOn: PauseGiftingOnOption.Sent,
      period: RefreshPeriod.Monthly,
      amount: 30032,
      rollover: false,
      notifyTeamAdminType: null,
      notifySenderType: null,
      notifySenderAtPercent: null,
      notifyTeamAdminAtPercent: null,
    };

    it('converts correctly', () => {
      const result = convertBudgetToDollars(budgetInCents);

      expect(result).toEqual({
        teamId: 37,
        teamMembers: [
          {
            userId: 1045,
            budget: 100,
          },
          {
            userId: 1046,
            budget: 100.12,
          },
          {
            userId: 1047,
            budget: 100.2,
          },
        ],
        pauseGiftingOn: PauseGiftingOnOption.Sent,
        period: 'monthly',
        amount: 300.32,
        rollover: false,
        notifyTeamAdminType: null,
        notifySenderType: null,
        notifySenderAtPercent: null,
        notifyTeamAdminAtPercent: null,
      });
    });
  });
});
